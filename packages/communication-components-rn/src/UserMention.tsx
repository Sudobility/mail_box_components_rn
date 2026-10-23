import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  Pressable,
  TextInput,
  type TextInputProps,
} from 'react-native';
import { cn, pressProps } from '@sudobility/components-rn';
import { colors } from '@sudobility/design';

export interface User {
  id: string;
  name: string;
  username: string;
  avatar?: string;
}

export interface UserMentionProps {
  /** Available users to mention */
  users: User[];
  /** Mention handler */
  onMention?: (user: User) => void;
  /** Input value */
  value: string;
  /** Value change handler */
  onChange: (value: string) => void;
  /** Placeholder */
  placeholder?: string;
  /** Additional className */
  className?: string;
  /** Optional tracking callback */
  onTrack?: (action: string) => void;
}

/**
 * UserMention Component
 *
 * Input with @mention autocomplete functionality.
 * Shows dropdown when user types @ symbol.
 *
 * @example
 * ```tsx
 * <UserMention
 *   users={[
 *     { id: '1', name: 'John Doe', username: 'johndoe', avatar: '/avatar1.jpg' },
 *     { id: '2', name: 'Jane Smith', username: 'janesmith' }
 *   ]}
 *   value={text}
 *   onChange={setText}
 *   onMention={(user) => console.log('Mentioned:', user)}
 * />
 * ```
 */
export const UserMention: React.FC<UserMentionProps> = ({
  users,
  onMention,
  value,
  onChange,
  placeholder = 'Type @ to mention someone...',
  className,
  onTrack,
}) => {
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [mentionStart, setMentionStart] = useState(-1);
  // RN has no `selectionStart` on the native input; we track the caret via
  // onSelectionChange instead and drive both the @ lookup and inserts from it.
  const [selection, setSelection] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const inputRef = useRef<React.ComponentRef<typeof TextInput>>(null);

  useEffect(() => {
    const text = value;
    const cursorPos = selection.start;

    // Find @ symbol before cursor
    let atPos = -1;
    for (let i = cursorPos - 1; i >= 0; i--) {
      if (text[i] === '@') {
        atPos = i;
        break;
      }
      if (text[i] === ' ' || text[i] === '\n') {
        break;
      }
    }

    if (atPos !== -1) {
      const query = text.slice(atPos + 1, cursorPos).toLowerCase();
      const filtered = users.filter(
        user =>
          user.name.toLowerCase().includes(query) ||
          user.username.toLowerCase().includes(query)
      );

      if (filtered.length > 0) {
        setFilteredUsers(filtered);
        setShowSuggestions(true);
        setMentionStart(atPos);
        setSelectedIndex(0);
      } else {
        setShowSuggestions(false);
      }
    } else {
      setShowSuggestions(false);
    }
  }, [value, users, selection.start]);

  const handleSelectionChange: NonNullable<
    TextInputProps['onSelectionChange']
  > = e => {
    setSelection(e.nativeEvent.selection);
  };

  const insertMention = (user: User) => {
    onTrack?.('mention_select');
    const before = value.slice(0, mentionStart);
    const after = value.slice(selection.start);
    const newValue = `${before}@${user.username} ${after}`;

    onChange(newValue);
    setShowSuggestions(false);

    if (onMention) {
      onMention(user);
    }

    // Move caret to just after the inserted mention.
    const newPos = mentionStart + user.username.length + 2;
    setSelection({ start: newPos, end: newPos });
    setTimeout(() => {
      inputRef.current?.focus();
    }, 0);
  };

  return (
    <View className={cn('relative', className)}>
      {/* TODO: web supported ArrowUp/ArrowDown/Enter/Escape keyboard nav of the
          suggestion list; on RN selection is tap-driven, so key handling is dropped. */}
      <TextInput
        ref={inputRef}
        value={value}
        onChangeText={onChange}
        onSelectionChange={handleSelectionChange}
        selection={selection}
        placeholder={placeholder}
        multiline
        numberOfLines={4}
        textAlignVertical='top'
        className={cn(
          'w-full px-4 py-3 border rounded-lg',
          colors.component.input.default.base,
          colors.component.input.default.dark
        )}
      />

      {/* Suggestions dropdown */}
      {showSuggestions && (
        <View
          className={cn(
            'absolute mt-1 w-full border max-h-60 bg-card border-border rounded-lg shadow-lg'
          )}
          style={{ top: '100%', zIndex: 10 }}
        >
          {filteredUsers.map((user, index) => (
            <Pressable
              key={user.id}
              {...pressProps(() => insertMention(user))}
              accessibilityRole='button'
              accessibilityLabel={`Mention ${user.name}`}
              className={cn(
                'w-full flex-row items-center gap-3 px-4 py-3',
                index === selectedIndex ? 'bg-primary/10' : 'active:bg-muted'
              )}
            >
              {user.avatar ? (
                <Image
                  source={{ uri: user.avatar }}
                  accessibilityLabel={user.name}
                  className='w-8 h-8 rounded-full'
                />
              ) : (
                <View className='w-8 h-8 rounded-full items-center justify-center bg-muted'>
                  <Text className='text-foreground font-semibold text-sm'>
                    {user.name.charAt(0).toUpperCase()}
                  </Text>
                </View>
              )}
              <View className='flex-1 min-w-0'>
                <Text className='font-medium text-foreground' numberOfLines={1}>
                  {user.name}
                </Text>
                <Text
                  className='text-sm text-muted-foreground'
                  numberOfLines={1}
                >
                  @{user.username}
                </Text>
              </View>
            </Pressable>
          ))}
        </View>
      )}
    </View>
  );
};
