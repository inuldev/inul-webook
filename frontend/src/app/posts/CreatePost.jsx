const CreatePost = ({ onSubmit }) => {
  const [content, setContent] = useState("");
  const [media, setMedia] = useState(null);
  const [preview, setPreview] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!content.trim() && !media) return;

    setIsLoading(true);
    await onSubmit({ content, media });
    setContent("");
    setMedia(null);
    setPreview("");
    setIsLoading(false);
    setShowEmoji(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setMedia(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Card className="w-full mb-6 bg-card dark:bg-[#242526] dark:border-gray-700">
      <CardContent className="p-4">
        <form onSubmit={handleSubmit}>
          <div className="relative">
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              placeholder="What's on your mind?"
              className="min-h-[100px] bg-secondary/50 dark:bg-gray-700 dark:text-gray-100 dark:placeholder-gray-400 dark:border-gray-600"
            />
            {preview && (
              <div className="relative mt-4">
                {media?.type?.startsWith("image") ? (
                  <img
                    src={preview}
                    alt="Preview"
                    className="w-full h-auto rounded-lg"
                  />
                ) : (
                  <video
                    src={preview}
                    controls
                    className="w-full h-auto rounded-lg"
                  />
                )}
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="absolute top-2 right-2 bg-gray-900/50 hover:bg-gray-900/75 text-white"
                  onClick={() => {
                    setMedia(null);
                    setPreview("");
                  }}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          <Separator className="my-4 dark:bg-gray-700" />

          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Input
                type="file"
                accept="image/*,video/*"
                onChange={handleFileChange}
                className="hidden"
                id="media-upload"
              />
              <Label
                htmlFor="media-upload"
                className="flex items-center space-x-2 cursor-pointer hover:bg-secondary/80 dark:hover:bg-gray-700 p-2 rounded-md"
              >
                <ImageIcon className="h-5 w-5 text-green-500" />
                <span className="text-sm text-muted-foreground">Photo/Video</span>
              </Label>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                onClick={() => setShowEmoji(!showEmoji)}
                className="dark:hover:bg-gray-700"
              >
                <Smile className="h-5 w-5 text-yellow-500" />
              </Button>
            </div>
            <Button 
              type="submit" 
              disabled={isLoading || (!content.trim() && !media)}
              className="dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Posting...
                </>
              ) : (
                "Post"
              )}
            </Button>
          </div>
          {showEmoji && (
            <div className="absolute right-0 mt-2 z-50">
              <EmojiPicker
                theme="dark"
                onEmojiClick={(emoji) => {
                  setContent((prev) => prev + emoji.emoji);
                  setShowEmoji(false);
                }}
              />
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

export default CreatePost;