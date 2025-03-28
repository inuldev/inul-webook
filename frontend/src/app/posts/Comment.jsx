const Comment = ({ comment }) => {
  return (
    <div className="flex items-start space-x-4 p-4 hover:bg-secondary/50 dark:hover:bg-gray-700/50 rounded-lg">
      <Avatar className="h-8 w-8">
        {comment?.user?.profilePicture ? (
          <AvatarImage
            src={comment?.user?.profilePicture}
            alt={comment?.user?.username}
          />
        ) : (
          <AvatarFallback className="bg-gray-200 dark:bg-gray-600">
            {comment?.user?.username?.charAt(0).toUpperCase()}
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="bg-secondary dark:bg-gray-700 p-3 rounded-2xl inline-block">
          <p className="font-semibold text-sm text-foreground">
            {comment?.user?.username}
          </p>
          <p className="text-sm text-foreground">{comment?.content}</p>
        </div>
        <div className="flex items-center space-x-4 mt-1">
          <button className="text-xs text-muted-foreground hover:underline">
            Like
          </button>
          <button className="text-xs text-muted-foreground hover:underline">
            Reply
          </button>
          <span className="text-xs text-muted-foreground">
            {formateDate(comment?.createdAt)}
          </span>
        </div>
      </div>
    </div>
  );
};

export default Comment;