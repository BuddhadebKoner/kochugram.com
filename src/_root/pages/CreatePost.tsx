import PostForm from "@/components/forms/PostForm"

const CreatePost = () => {
  return (
    <div className="flex flex-1">
      <div className="common-container">
        <div className="max-w-5xl flex-start gap-3 justify-start w-full">
          <img
            src="assets/icons/gallery-add.svg"
            alt="add"
            width={30}
            height={30}
            className="invert-white"
          />
          <h1 className="h3-bold md:h2-bold text-left w-full">
            Create new post
          </h1>
        </div>
        <PostForm
          action='Create'
        />
      </div>
    </div>
  )
}

export default CreatePost