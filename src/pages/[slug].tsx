import { createServerSideHelpers } from "@trpc/react-query/server";
import { type GetStaticPaths, type GetStaticProps, type NextPage } from "next";
import Head from "next/head";
import { api } from "~/utils/api";

import { appRouter } from "~/server/api/root";
import { prisma } from "~/server/db";

import superjson from "superjson";
import { PageLayout } from "~/components/layout";
import Image from "next/image";

const ProfilePage: NextPage<{ username: string }> = ({ username }) => {
  const { data, isLoading } = api.profile.getUserByUsername.useQuery({
    username,
  });

  // App will never hit loading state, because of the prefetch in trpc SSG
  if (isLoading) return <div>Loading...</div>;

  if (!data) return <div>404</div>;

  return (
    <>
      <Head>
        <title>@{data.username}</title>
      </Head>
      <PageLayout>
        <div className="relative h-36 bg-slate-700 p-4">
          <Image
            src={data.profileImageUrl}
            alt={`@${data.username ?? ""}'s profile pic`}
            width={128}
            height={128}
            className="absolute bottom-0 left-0 -mb-16 ml-4 rounded-full border-4 border-slate-900 bg-slate-900"
          />
        </div>
        <div className="h-16"></div>
        <div className="p-4 text-2xl font-bold">@{data.username}</div>
        <div className="w-full border-b border-slate-400"></div>
      </PageLayout>
    </>
  );
};

export const getStaticProps: GetStaticProps = async (context) => {
  const ssg = createServerSideHelpers({
    router: appRouter,
    ctx: {
      prisma,
      userId: null,
    },
    transformer: superjson,
  });

  const slug = context.params?.slug;

  if (typeof slug !== "string") throw new Error("no slug");

  const username = slug.replace("@", "");

  await ssg.profile.getUserByUsername.prefetch({
    username,
  });

  return {
    props: {
      trpcState: ssg.dehydrate(),
      username,
    },
  };
};

export const getStaticPaths: GetStaticPaths = () => {
  return { paths: [], fallback: "blocking" };
};

export default ProfilePage;
