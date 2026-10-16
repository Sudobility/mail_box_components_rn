/**
 * UserMenu - User avatar with a dropdown menu for React Native
 */

import React, { useState } from 'react';
import { View, Text, Pressable, Modal } from 'react-native';
import { cn } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';
import type { AuthMenuItem, AuthUser } from './types';
import { useAuthStatus } from './AuthProvider';
import { Avatar } from './Avatar';
import { pressProps } from '@sudobility/components-rn';

export interface UserMenuProps {
  menuItems?: AuthMenuItem[];
  showUserInfo?: boolean;
  renderUserInfo?: (user: AuthUser) => React.ReactNode;
  renderAvatar?: (user: AuthUser) => React.ReactNode;
  avatarSize?: number;
  /** Which side the dropdown is anchored to */
  dropdownAlign?: 'left' | 'right';
  /** Called when logout is pressed (before signOut) */
  onLogoutPress?: () => void;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

/**
 * User menu dropdown component.
 *
 * Note: the web version anchors an absolutely-positioned dropdown below the
 * avatar and closes on outside click. RN has no document-level click handling,
 * so this uses a transparent Modal with a backdrop press to dismiss; the menu
 * is anchored near the top-{left|right} rather than measured against the avatar.
 */
export const UserMenu: React.FC<UserMenuProps> = ({
  menuItems = [],
  showUserInfo = true,
  renderUserInfo,
  renderAvatar,
  avatarSize = 32,
  dropdownAlign = 'right',
  onLogoutPress,
  onTrack,
}) => {
  const { user, signOut, texts } = useAuthStatus();
  const [isOpen, setIsOpen] = useState(false);

  if (!user) return null;

  const handleLogout = async () => {
    setIsOpen(false);
    onTrack?.('logout_click');
    onLogoutPress?.();
    await signOut();
  };

  const handleMenuItemPress = (item: AuthMenuItem) => {
    if (item.disabled) return;
    setIsOpen(false);
    onTrack?.(`menu_item_click:${item.id}`);
    item.onPress();
  };

  const handleToggleMenu = () => {
    const newState = !isOpen;
    if (newState) {
      onTrack?.('menu_open');
    }
    setIsOpen(newState);
  };

  return (
    <View className='relative'>
      {/* Avatar trigger */}
      {renderAvatar ? (
        <Pressable
          {...pressProps(handleToggleMenu)}
          accessibilityRole='button'
          accessibilityLabel='User menu'
        >
          {renderAvatar(user)}
        </Pressable>
      ) : (
        <Avatar user={user} size={avatarSize} onPress={handleToggleMenu} />
      )}

      {/* Dropdown menu */}
      <Modal
        visible={isOpen}
        transparent
        animationType='fade'
        onRequestClose={() => setIsOpen(false)}
      >
        <Pressable
          {...pressProps(() => setIsOpen(false))}
          className='flex-1'
          accessibilityRole='button'
          accessibilityLabel='Close menu'
        >
          <View
            className={cn(
              'absolute top-16 mx-4 w-56',
              'rounded-lg shadow-lg bg-background border border-border py-1',
              dropdownAlign === 'right' ? 'right-0' : 'left-0'
            )}
          >
            {/* Stop presses inside the menu from dismissing it */}
            <Pressable onPress={() => {}}>
              {/* User info section */}
              {showUserInfo && (
                <View className='px-4 py-3 border-b border-border'>
                  {renderUserInfo ? (
                    renderUserInfo(user)
                  ) : (
                    <>
                      {user.displayName && (
                        <Text className={textVariants.label.default()} numberOfLines={1}>
                          {user.displayName}
                        </Text>
                      )}
                      {user.email && (
                        <Text className={textVariants.caption.default()} numberOfLines={1}>
                          {user.email}
                        </Text>
                      )}
                    </>
                  )}
                </View>
              )}

              {/* Custom menu items */}
              {menuItems.map(item => (
                <View key={item.id}>
                  <Pressable
                    {...pressProps(() => handleMenuItemPress(item), item.disabled)}
                    disabled={item.disabled}
                    className={cn(
                      'w-full px-4 py-2 flex-row items-center gap-2 active:bg-muted',
                      item.disabled && 'opacity-50'
                    )}
                    accessibilityRole='button'
                    accessibilityLabel={item.label}
                    accessibilityState={{ disabled: item.disabled }}
                  >
                    {item.icon}
                    <Text className='text-foreground'>{item.label}</Text>
                  </Pressable>
                  {item.dividerAfter && <View className='my-1 border-t border-border' />}
                </View>
              ))}

              {/* Divider before logout if there are menu items */}
              {menuItems.length > 0 &&
                !menuItems[menuItems.length - 1]?.dividerAfter && (
                  <View className='my-1 border-t border-border' />
                )}

              {/* Logout button */}
              <Pressable
                {...pressProps(handleLogout)}
                className='w-full px-4 py-2 active:bg-muted'
                accessibilityRole='button'
                accessibilityLabel={texts.logout}
              >
                <Text className='text-destructive'>{texts.logout}</Text>
              </Pressable>
            </Pressable>
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};
