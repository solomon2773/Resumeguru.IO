let GetSearchRecipesByNameBuffer = '';

switch(process.env.BACKEND_PROVIDER) {

    case 'MongoDB':
        switch(process.env.BACKEND_VERSION) {

            case '2023-01':
                GetSearchRecipesByNameBuffer = `
                query searchRecipes($query: RecipeQueryInput!){
                          recipes(query:$query){
                            _id
                            name
                            images {
                              Bucket
                              Key
                              height
                              name
                              type
                              url
                              width
                            }
                          }
                        }
                         
                  
                `;
                break;
            default:
                GetSearchRecipesByNameBuffer = '';
        }
        break;
    default:
        GetSearchRecipesByNameBuffer = '';
}

export const GetSearchRecipesByName = GetSearchRecipesByNameBuffer
