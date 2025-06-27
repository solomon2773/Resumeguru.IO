import CommonLayout from "../../components/Layout/MainLayout";


export default function BlogHome({blogPosts}) {
    // console.log(blogPosts)
    // console.log(blogPosts[0].author.avatar)


    return (
        <>
            <CommonLayout
                parent="home"
                title="ResumeGuru.IO - Blog - News and Updates"
                meta_title="ResumeGuru.IO - Blog - News and Updates"
                meta_desc="ResumeGuru.IO - Blog - News and Updates"
                ogType={"website"}
                ogUrl={process.env.SITE_URL}
                ogImage={process.env.SEO_DEFAULT_OG_IMAGE}

            >
                <div className="bg-white py-24 sm:py-32">
                    <div className="mx-auto max-w-7xl px-6 lg:px-8">
                        <div className="mx-auto max-w-2xl text-center">
                            <h2 className="text-balance text-4xl font-semibold tracking-tight text-gray-900 sm:text-5xl">
                                From the blog
                            </h2>
                            <p className="mt-2 text-lg/8 text-gray-600">ResumeGuru.IO News and Updates</p>
                        </div>
                        <div className="mx-auto mt-16 grid max-w-2xl grid-cols-1 gap-x-8 gap-y-20 lg:mx-0 lg:max-w-none lg:grid-cols-3">
                            {blogPosts && blogPosts.length > 0 && blogPosts.map((post) => (
                                <article key={post.documentId} className="flex flex-col items-start justify-between">
                                    <div className="relative w-full">
                                        {post.cover && post.cover.url ? (
                                            <img
                                                alt={post.cover.alternativeText ? post.cover.alternativeText : post.title+" - cover image"}
                                                src={process.env.BLOG_HOST_URL+post.cover.url}
                                                className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                            />
                                        ) : (
                                            <img
                                                alt={ post.title+" - cover image"}
                                                src={process.env.SEO_DEFAULT_OG_IMAGE}
                                                className="aspect-video w-full rounded-2xl bg-gray-100 object-cover sm:aspect-[2/1] lg:aspect-[3/2]"
                                            />
                                        )}

                                        <div className="absolute inset-0 rounded-2xl ring-1 ring-inset ring-gray-900/10" />
                                    </div>
                                    <div className="max-w-xl">
                                        <div className="mt-8 flex items-center gap-x-4 text-xs">
                                            <time dateTime={post.publishedAt} className="text-gray-500">
                                                {post.publishedAt}
                                            </time>
                                            <a
                                                href={post.category.href}
                                                className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                                            >
                                                {post.title}
                                            </a>
                                        </div>
                                        <div className="group relative">
                                            <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                                                <a href={post.href}>
                                                    <span className="absolute inset-0" />
                                                    {post.title}
                                                </a>
                                            </h3>
                                            <p className="mt-5 line-clamp-3 text-sm/6 text-gray-600">{post.description}</p>
                                        </div>
                                        <div className="relative mt-8 flex items-center gap-x-4">
                                            <img alt="" src={process.env.BLOG_HOST_URL+post.author.avatar.url} className="h-10 w-10 rounded-full bg-gray-100" />
                                            <div className="text-sm/6">
                                                <p className="font-semibold text-gray-900">
                                                    <a href={post.author.href}>
                                                        <span className="absolute inset-0" />
                                                        {post.author.name}
                                                    </a>
                                                </p>
                                                <p className="text-gray-600">{post.author.role}</p>
                                            </div>
                                        </div>
                                    </div>
                                </article>
                            ))}
                        </div>
                    </div>
                </div>



            </CommonLayout>
        </>
    )
}

export async function getStaticProps() {
    try {

            const response = await fetch(process.env.NEXT_PUBLIC_STRAPI_API_URL+'/articles?sort[0]=publishedAt:desc&pagination[limit]=6&fields[0]=title&fields[1]=description&fields[2]=publishedAt&fields[3]=slug&populate[cover][fields][0]=url&populate[author][fields][0]=name&populate[author][fields][1]=email&populate[author][populate][avatar][fields][0]=url&populate[category][fields][0]=name');
            if (!response.ok) {

                return {
                    props: {
                        blogPosts: [],
                        error: true,
                        errorMsg: response.statusText,
                    },
                    revalidate: 10,
                };
            }   else {

                const data = await response.json()
                return {
                    props: {
                        blogPosts: data.data,
                        error: false,
                    },
                    revalidate: 10, // ISR
                };
            }



    } catch (error) {
        console.error(error);
        return {
            props: {
                blogPosts: [],
                error: true,
                errorMsg: error.message,
            },
            revalidate: 10, // ISR to retry later
        };
    }
}
