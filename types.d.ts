type Option<T> = { label: string, value: T };

type Rule = {
    id: number;
    title: string;
    description: string;
    created_at: string;
}

type Ban = {
    id: number;
    user: number;
    community: number;
    reason: string;
    banned_at: string;
    expires_at: string | null;
    is_permanent: boolean;
    is_active: boolean;
}

type Member = {
    id: number;
    user: User;
    community: number;
    joined_at: string;
    ban: Ban | null;
    is_moderator: boolean;
    is_creator: boolean;
}

type InteractionType = "downvote" | "upvote";

type PostStatus = "accepted" | "removed" | "pending";

type Community = {
    id: number;
    name: string;
    description: string;
    banner: string | null;
    icon: string | null;
    rules: Rule[];
    moderators: Member[];
    members_count: number;
    online_members_count: number;
    topics: Topic[];
    is_member : boolean;
    member_id: number;
    is_moderator: boolean;
    created_at: string;
    is_creator: boolean;
    is_favorite: boolean;
}

type Topic = {
    id: number;
    name: string;
}

type PostType = "text" | "link" | "media" | "crosspost" | "poll";

type Post = {
    id: number;
    type: PostType;
    status: PostStatus;
    created_at: string;
    user: User,
    interaction_diff: number;
    attachments?: Attachment[];
    is_author: boolean;
    title: string;
    content?: string;
    link?: string;
    original_post: Post | null;
    community: Community | null;
    saved_post_id: number | null;
    comments_count: number;
    interaction: PostInteraction | null;
    is_spoiler: boolean;
    is_nsfw: boolean;
    is_reported: boolean;
}

type SavedPost = {
    id: number;
    post: Post;
}

type User = {
    id: number; 
    username: string;
    email: string;
    bio: string;
    image: string | null;
    created_at: string;
    post_karma: number;
    comment_karma: number;
    followers_count: number;
    follow_id: number | null;
    block_id: number | null;
    is_current_user: boolean;
}

type BlockedUser = User & {
    block_id: number;
}

type CommentStatus = "accepted" | "removed";

type Theme = "dark" | "light" | "system";

type CommentType = {
    id: number;
    parent?: CommentType;
    status: CommentStatus;
    is_reported: boolean;
    user: User
    post: Post;
    created_at: string;
    content: string;
    interaction_diff: number;
    is_author: boolean;
    interaction: CommentInteraction | null;
    replies: CommentType[];
}

type Attachment = {
    id: number;
    file: string;
    file_type: string;
}

type PostInteraction = {
    id: number;
    post: number;
    interaction_type: InteractionType;
}

type CommentInteraction = {
    id: number;
    comment: number;
    interaction_type: InteractionType;
}

type Follow = {
    id: number;
    user: number;
    followed: number;
    // user_detail: User;
    // followed_detail: User;
}

type RecentPostsContextType = {
    posts: RecentPost[],
    addPost: (post: RecentPost) => void
    removePosts: () => void;
}

type RecentPost = {
    id: number,
    title: string, 
    user: User, 
    community: Community | null,
}

type NotificationType = {
    id: number;
    message: string;
    content_type: string;
    object_id: number;
    content_object: Post | CommentType | Follow;
    created_at: string;
    is_read: boolean;
}

type ChatsContextType = {
    chats: Chat[],
    currentChatId: number | null;
    userId: number | null;
    isChatsOpen: boolean;
    isLoading: boolean;
    isError: booleanl;
    isChatsExpanded: boolean;
    toggleChatsExpansion: () => void;
    toggleChats: () => void;
    setChats: (chats: Chat[]) => void;
    setCurrentChatId: (chatId: number | null) => void;
    setUserId: (userId: number | null) => void;
}

type Chat = {
    id: number;
    other_participant: User | null;
    last_message: Message | null;
    unread_messages_count: number;
    created_at: string;
}

type Message = {
    id: number;
    chat: number;
    user: Partial<User>;
    content: string;
    created_at: string;
    is_read: boolean;
}

type PostReport = {
    id: number;
    user: User;
    post: Post;
    reason: string;
    created_at: string;
    violated_rule?: Rule;
    status: ReportStatus;
}

type CommentReport = {
    id: number;
    user: User;
    comment: CommentType;
    reason: string;
    created_at: string;
    violated_rule?: Rule;
    status: ReportStatus;
}

type ReportStatus = "pending" | "reviewed" | "dismissed";