exports.CleanAnItem = (item) => {
    // console.log("hello from clean item")
    // Get the backend server URL from the environment variable or use an empty string if not defined
    const backendServerUrl = process.env.BackEndServerUrl || '';
    // Check if the item has a photoPath property
    if (item["photoPath"]) {
            // Remove any trailing slashes from the backend server URL
            const cleanedBackendUrl = backendServerUrl.replace(/\/+$/, '');
            // Remove any leading slashes from the photo path
            const cleanedPhotoPath = item["photoPath"].replace(/^\/+/, '');
            // Concatenate the backend URL and photo path with a single slash in between
            const finalUrl = `${cleanedBackendUrl}/${cleanedPhotoPath}`;
            // console.log(finalUrl)
            // Update the photoPath in the item to the final URL
            item["photoPath"] = finalUrl;
            // console.log(finalUrl);
        }
    return item;
}


exports.ConcacatPhotoPathAndBackendUrl = (result) =>
{

    
    if (Array.isArray(result))
    {
        result.map(exports.CleanAnItem)
    }
    if("photoPath" in result)
    {
        // console.log(result)
        // console.log("cleaning item")
        result = exports.CleanAnItem(result);
        // console.log(result)
    }
    
    

    return result;

}

