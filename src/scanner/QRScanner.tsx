import { useEffect } from 'react';
import { View, Pressable, StyleSheet, Dimensions } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import {
  Camera,
  useCameraDevice,
  useCameraPermission,
  useCodeScanner,
} from 'react-native-vision-camera';
import { Text } from '../ui/Text';
import { Button } from '../ui/Button';
import { pressProps } from '../lib/a11y';

const { height: SCREEN_HEIGHT } = Dimensions.get('window');
const FRAME_SIZE = 250;

export interface QRScannerProps {
  /** Called with the decoded QR value each time a code is read. */
  onScan: (value: string) => void;
  /** Cancel/close affordance (top-left). The button is hidden when omitted. */
  onClose?: () => void;
  /** Instruction line shown near the bottom. */
  instruction?: string;
  /** Label for the top-left cancel button. Default "Cancel". */
  cancelLabel?: string;
  /** Message shown while camera permission has not been granted. */
  permissionText?: string;
  /** Label for the grant-permission button. Default "Allow camera access". */
  grantLabel?: string;
  /** Pause scanning while false (e.g. while handling a scan). Default true. */
  active?: boolean;
}

/**
 * Full-screen QR code scanner built on react-native-vision-camera. Renders the
 * camera edge-to-edge with a centred scan frame (centre at 40% of height), a
 * top-left cancel, and a bottom instruction line — all respecting the safe-area
 * insets. Camera-only: there is no photo-library fallback, so a caller that must
 * run on a simulator (no camera) should provide its own picker.
 *
 * Peer deps the consuming app must install: react-native-vision-camera,
 * react-native-worklets, react-native-safe-area-context.
 */
export function QRScanner({
  onScan,
  onClose,
  instruction,
  cancelLabel = 'Cancel',
  permissionText,
  grantLabel = 'Allow camera access',
  active = true,
}: QRScannerProps) {
  const insets = useSafeAreaInsets();
  const device = useCameraDevice('back');
  const { hasPermission, requestPermission } = useCameraPermission();

  useEffect(() => {
    if (!hasPermission) {
      void requestPermission();
    }
  }, [hasPermission, requestPermission]);

  const codeScanner = useCodeScanner({
    codeTypes: ['qr'],
    onCodeScanned: codes => {
      const value = codes[0]?.value;
      if (value) {
        onScan(value);
      }
    },
  });

  // Permission not granted yet: prompt with a grant button (auto-requested above).
  if (!hasPermission) {
    return (
      <View style={styles.center} className='bg-background'>
        {!!permissionText && (
          <Text size='base' align='center' className='mb-5'>
            {permissionText}
          </Text>
        )}
        <Button
          variant='primary'
          className='rounded-xl py-3 px-6'
          onPress={requestPermission}
        >
          {grantLabel}
        </Button>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {device && (
        <Camera
          style={StyleSheet.absoluteFill}
          device={device}
          isActive={active}
          codeScanner={codeScanner}
        />
      )}

      {onClose && (
        <Pressable
          {...pressProps(onClose)}
          accessibilityRole='button'
          accessibilityLabel={cancelLabel}
          style={[styles.cancel, { top: insets.top + 8 }]}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text size='base' weight='medium' className='text-white'>
            {cancelLabel}
          </Text>
        </Pressable>
      )}

      {/* Scan frame — border uses the theme primary color; centre at 40% height. */}
      <View style={styles.frameWrap} pointerEvents='none'>
        <View style={styles.frame} className='border-primary' />
      </View>

      {!!instruction && (
        <View
          style={[
            styles.bottom,
            { paddingBottom: Math.max(insets.bottom, 16) + 24 },
          ]}
          pointerEvents='none'
        >
          <Text size='base' align='center' className='text-white'>
            {instruction}
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#000' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  cancel: { position: 'absolute', left: 16, zIndex: 10, padding: 8 },
  frameWrap: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: SCREEN_HEIGHT * 0.4 - FRAME_SIZE / 2,
    alignItems: 'center',
  },
  frame: {
    width: FRAME_SIZE,
    height: FRAME_SIZE,
    borderRadius: 16,
    borderWidth: 2,
  },
  bottom: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    paddingHorizontal: 20,
  },
});
