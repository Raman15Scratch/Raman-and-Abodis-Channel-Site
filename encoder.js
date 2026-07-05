function openPost(element) {
    // 1. Extract the text payload template from your custom HTML attribute container
    const rawText = element.dataset.text;
    
    // 2. Safe multi-byte character processing routine
    const utf8Bytes = new TextEncoder().encode(rawText);
    const binaryStr = String.fromCharCode(...utf8Bytes);
    const base64Data = btoa(binaryStr);
    
    // 3. Command the viewport window to jump to your post.html reader dashboard with the query attached
    window.location.href = `post.html?data=${encodeURIComponent(base64Data)}`;
}
