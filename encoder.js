// Finds EVERY button that contains posts
const postButtons = document.querySelectorAll('.post-btn');

// Loop through each button and listen for clicks
postButtons.forEach(button => {
    button.addEventListener('click', function() {
        // 1. Grabs the raw text from the data-text attribute
        const rawText = this.dataset.text;
        
        // 2. Encodes it safely to Base64 (supporting emojis & special characters)
        const utf8Bytes = new TextEncoder().encode(rawText);
        const binaryStr = String.fromCharCode(...utf8Bytes);
        const base64Data = btoa(binaryStr);
        
        // 3. Sends the user to post.html with the unique data string attached
        window.location.href = `post.html?data=${encodeURIComponent(base64Data)}`;
    });
});
