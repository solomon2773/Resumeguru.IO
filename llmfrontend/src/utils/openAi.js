export async function estimateTokenCount(text, factor = 1.0) {
    // Ensure the text is a string, or use an empty string as a fallback
    const validText = (typeof text === 'string' && text) ? text : '';

    // Split the text by whitespace and other common delimiters, then filter out empty strings
    const tokens = validText.trim().split(/(\s+|\.|\,|\!|\?|\:|\;|\(|\)|\-|\—|\‘|\’|\“|\”|\"|\'|\[|\])/).filter(token => token.trim().length > 0);

    return Math.round(tokens.length * factor);
}


