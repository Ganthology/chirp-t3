import { SignInButton, useUser } from "@clerk/nextjs";
import { type NextPage } from "next";
import Head from "next/head";
import { type RouterOutputs, api } from "~/utils/api";

import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import Image from "next/image";

dayjs.extend(relativeTime);

const CreatePostWizard = () => {
  const { user } = useUser();

  if (!user) return null;

  return (
    <div className="flex gap-2">
      <Image
        src={user.profileImageUrl}
        alt="User Profile Image"
        className="rounded-full"
        width={56}
        height={56}
      />
      <input
        placeholder="Type some emojis!"
        className="grow bg-transparent px-2 focus:outline"
      />
    </div>
  );
};

type PostWithUser = RouterOutputs["posts"]["getAll"][number];
const PostView = (props: PostWithUser) => {
  const { post: p, author: a } = props;

  return (
    <div key={p.id} className="flex gap-4 border-b border-slate-400 p-4">
      <Image
        src={a.profileImageUrl}
        alt={`@${a.username}'s profile image`}
        className="rounded-full"
        width={56}
        height={56}
      />
      <div className="flex flex-col">
        <div className="flex text-slate-300">
          <span>@{a.username}</span>
          <span className="px-1 font-thin">{` • ${dayjs(
            p.createdAt
          ).fromNow()}`}</span>
        </div>
        <span>{p.content}</span>
      </div>
    </div>
  );
};

const Home: NextPage = () => {
  const user = useUser();

  const { data, isLoading, isError } = api.posts.getAll.useQuery();

  if (isLoading) return <div>Loading...</div>;

  if (isError) return <div>Bumped into some errors...</div>;

  if (!data) return <div>Something went wrong...</div>;

  return (
    <>
      <Head>
        <title>Create T3 App</title>
        <meta name="description" content="Generated by create-t3-app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen justify-center">
        <div className="h-full w-full border-x border-slate-400 md:max-w-2xl">
          <div className="border-b border-slate-400 p-4">
            <h1 className="text-6xl font-bold text-white">
              User is {!!user.isSignedIn ? "Logged In" : "Not Logged In"}
            </h1>
          </div>
          <div className="border-b border-slate-400 p-4">
            {!user.isSignedIn && <SignInButton />}
            {!!user.isSignedIn && <CreatePostWizard />}
          </div>
          <div className="">
            {data?.map((fullPost) => (
              <PostView {...fullPost} key={fullPost.post.id} />
            ))}
          </div>
        </div>
      </main>
    </>
  );
};

export default Home;
