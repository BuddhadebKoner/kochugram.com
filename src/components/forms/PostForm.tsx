import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import {
   Form,
   FormControl,
   FormField,
   FormItem,
   FormLabel,
   FormMessage,
} from "@/components/ui/form"
import { Textarea } from "../ui/textarea"
import { Input } from "@/components/ui/input"
import { postValidation } from "@/lib/validation"
import FileUploader from "../shared/FileUploader"
import { Models } from "appwrite"
import {  useCreatePost } from "@/lib/react-query/queriesAndMutation"
import { useUserContext } from "@/context/AuthContext"
import { toast } from "@/hooks/use-toast"

type PostFormsProps = {
   post?: Models.Document;
}

const PostForm = ({ post }: PostFormsProps) => {
   const navigate = useNavigate();

   const { mutateAsync: createPost, isPending: IsLoadingCreate } = useCreatePost();
   const { user } = useUserContext();


   // 1. Define your form.
   const form = useForm<z.infer<typeof postValidation>>({
      resolver: zodResolver(postValidation),
      defaultValues: {
         caption: post ? post?.caption : "",
         file: [],
         location: post ? post?.location : "",
         tags: post ? post.tags.join(',') : ""
      },
   })

   // 2. Define a submit handler.
   async function onSubmit(values: z.infer<typeof postValidation>) {
      const newPost = await createPost({
         ...values,
         userId: user.id
      })

      if (!newPost) {
         toast({ title: "please try again" })
      }
      navigate('/');
   }

   return (
      <Form {...form}>
         <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col gap-9 w-full max-w-5xl">
            <FormField
               control={form.control}
               name="caption"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_lable">Caption</FormLabel>
                     <FormControl>
                        <Textarea {...field}
                           className="shad-textarea custom-scrollbar shad-input"
                           placeholder="Write caprtions" />
                     </FormControl>
                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="file"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_lable">Add Photos</FormLabel>
                     <FormControl>
                        <FileUploader
                           fieldChnage={field.onChange}
                           mediaUrl={post?.mediaUrl}
                        />
                     </FormControl>
                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="location"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_lable">Enter Loacation</FormLabel>
                     <FormControl>
                        <Input {...field} type="text" className="shad-input" placeholder="Enter Your location" />
                     </FormControl>
                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <FormField
               control={form.control}
               name="tags"
               render={({ field }) => (
                  <FormItem>
                     <FormLabel className="shad-form_lable">Add tags (separated by comma " ,")</FormLabel>
                     <FormControl>
                        <Input {...field}
                           type="text"
                           className="shad-input"
                           placeholder="Tech, Nature, Fassion" />
                     </FormControl>
                     <FormMessage className="shad-form_message" />
                  </FormItem>
               )}
            />
            <div className="w-full flex flex-col gap-5 md:items-center md:justify-end md:flex-row">
               <Button
                  type="button"
                  className="shad-button_dark_4">Cancel</Button>
               <Button
                  type="submit"
                  className="shad-button_primary whitespace no-wrap"
               >Submit</Button>
            </div>
         </form>
      </Form>
   )
}

export default PostForm