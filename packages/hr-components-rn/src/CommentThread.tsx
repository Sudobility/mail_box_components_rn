import React, { useState } from 'react';
import { View, Text, Pressable } from 'react-native';
import { cn, pressProps, Avatar, Input, Button } from '@sudobility/components-rn';
import { textVariants } from '@sudobility/design';

export interface Comment {
  id: string;
  author: string;
  avatar?: string;
  content: string;
  timestamp: string;
  replies?: Comment[];
}

export interface CommentThreadProps {
  /** Comments data */
  comments: Comment[];
  /** Reply handler */
  onReply?: (commentId: string, content: string) => void;
  /** Delete handler */
  onDelete?: (commentId: string) => void;
  /** Max nesting level */
  maxDepth?: number;
  /** Additional className */
  className?: string;
}

/**
 * CommentThread Component
 *
 * Nested comment thread with replies.
 * Supports avatars, timestamps, and actions.
 *
 * @example
 * ```tsx
 * <CommentThread
 *   comments={[
 *     {
 *       id: '1',
 *       author: 'John Doe',
 *       content: 'Great article!',
 *       timestamp: '2 hours ago',
 *       replies: [...]
 *     }
 *   ]}
 *   onReply={(id, content) => handleReply(id, content)}
 *   maxDepth={3}
 * />
 * ```
 */
export const CommentThread: React.FC<CommentThreadProps> = ({
  comments,
  onReply,
  onDelete,
  maxDepth = 5,
  className,
}) => {
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState('');

  const handleSubmitReply = (commentId: string) => {
    if (onReply && replyContent.trim()) {
      onReply(commentId, replyContent);
      setReplyContent('');
      setReplyingTo(null);
    }
  };

  const CommentItem = ({
    comment,
    depth = 0,
  }: {
    comment: Comment;
    depth?: number;
  }) => {
    const canNest = depth < maxDepth;

    return (
      <View className={cn('flex-row gap-3', depth > 0 && 'ml-8 mt-4')}>
        {/* Avatar */}
        <View>
          <Avatar
            size='md'
            src={comment.avatar}
            name={comment.author}
            alt={comment.author}
          />
        </View>

        <View className='flex-1 min-w-0'>
          {/* Header */}
          <View className='flex-row items-center gap-2 mb-1'>
            <Text className='font-semibold text-foreground'>
              {comment.author}
            </Text>
            <Text className='text-sm text-muted-foreground'>
              {comment.timestamp}
            </Text>
          </View>

          {/* Content */}
          <Text className='text-foreground mb-2'>{comment.content}</Text>

          {/* Actions */}
          <View className='flex-row items-center gap-4'>
            {onReply && canNest && (
              <Pressable
                {...pressProps(() => setReplyingTo(comment.id))}
                accessibilityRole='button'
                accessibilityLabel='Reply'
              >
                <Text className={cn('text-sm', textVariants.link.subtle())}>
                  Reply
                </Text>
              </Pressable>
            )}
            {onDelete && (
              <Pressable
                {...pressProps(() => onDelete(comment.id))}
                accessibilityRole='button'
                accessibilityLabel='Delete'
              >
                <Text className='text-sm text-destructive'>Delete</Text>
              </Pressable>
            )}
          </View>

          {/* Reply form */}
          {replyingTo === comment.id && (
            <View className='mt-3 flex-row gap-2'>
              <Input
                className='flex-1'
                value={replyContent}
                onChangeText={setReplyContent}
                placeholder='Write a reply...'
              />
              <Button
                variant='primary'
                size='sm'
                onPress={() => handleSubmitReply(comment.id)}
              >
                Post
              </Button>
              <Button
                variant='secondary'
                size='sm'
                onPress={() => {
                  setReplyingTo(null);
                  setReplyContent('');
                }}
              >
                Cancel
              </Button>
            </View>
          )}

          {/* Nested replies */}
          {comment.replies && comment.replies.length > 0 && (
            <View className='mt-4'>
              {comment.replies.map(reply => (
                <CommentItem key={reply.id} comment={reply} depth={depth + 1} />
              ))}
            </View>
          )}
        </View>
      </View>
    );
  };

  return (
    <View className={cn('gap-6', className)}>
      {comments.map(comment => (
        <CommentItem key={comment.id} comment={comment} />
      ))}
    </View>
  );
};
