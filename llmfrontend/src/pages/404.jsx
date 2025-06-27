import CommonLayout from "../components/Layout/MainLayout";
export default function Home() {
  return (
    <>
        <CommonLayout
            parent="home"
            title="ResumeGuru - 404 Page not found."
            meta_title="ResumeGuru - 404 Page not found."
            meta_desc={process.env.SEO_DEFAULT_DESCRIPTION}
        >


            <main className="relative isolate min-h-full">
                <img
                    src="https://images.unsplash.com/photo-1545972154-9bb223aac798?ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&ixlib=rb-1.2.1&auto=format&fit=crop&w=3050&q=80&exp=8&con=-15&sat=-75"
                    alt="404 not found background image"
                    className="absolute inset-0 -z-10 h-full w-full object-cover object-top"
                />
                <div className="mx-auto max-w-7xl px-6 py-32 text-center sm:py-40 lg:px-8">
                    <p className="text-base font-semibold leading-8 text-white">404</p>
                    <h1 className="mt-4 text-3xl font-bold tracking-tight text-white sm:text-5xl">Page not found</h1>
                    <p className="mt-4 text-base text-white/70 sm:mt-6">Sorry, we couldn’t find the page you’re looking for.</p>
                    <div className="mt-10 flex justify-center">
                        <a href={process.env.SITE_URL} className="text-sm font-semibold leading-7 text-white">
                            <span aria-hidden="true">&larr;</span> Back to home
                        </a>
                    </div>
                </div>
            </main>


        </CommonLayout>
    </>
  )
}

// export const getServerSideProps = async (context) => {
//     // const { req } = context;
//          try {
//             const user = await loginApiKey();
//             // Perform a user-specific operation...
//             const myRecipeCollection = user.mongoClient(process.env.MONGODB_SERIVCE_NAME).db(process.env.MONGODB_DB_NAME).collection("recipe");
//             // const recipes = await myRecipeCollection.find(
//             //     {
//             //         images: {$exists: true, $ne: [] },
//             //     },
//             //     {
//             //         projection: {_id: 1, images: 1, name: 1, ingredients: 1},
//             //         limit: 24,
//             //         sort: { timestamp: -1 }});
//
//              const randomSample = await myRecipeCollection.aggregate([
//                  { $sample: { size: 24 } },
//                  { $project: {_id: 1, images: 1, name: 1, ingredients: 1}}
//              ]);
//
//             return {
//                 props: {
//                     recipeFound: true,
//                     userRecipes: {
//                         myRecipes: await JSON.parse(JSON.stringify(randomSample)),
//                         myFavoriteRecipes: [],
//                     },
//
//                 },
//             };
//             //  res.status(200).json(documents);
//         } catch (error) {
//             // res.status(401).json({ error: 'Unauthorized' });
//             return {
//                 props: {
//                     recipeFound: false,
//                     userRecipes: null,
//
//                 },
//             };
//         }
//
//
//
//
// };
