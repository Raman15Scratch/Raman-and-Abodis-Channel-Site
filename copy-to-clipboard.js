function copyCurrentUrl() {
    // 1. Get the current page URL
    const currentUrl = window.location.href;
    
    // 2. Use the modern Clipboard API to copy it
    navigator.clipboard.writeText(currentUrl)
        .then(() => {
            // 3. Provide visual feedback to the user
            const btn = document.getElementById('copyBtn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Copied!';
            btn.style.backgroundColor = '#4CAF50'; // Optional: change color to green
            
            // 4. Reset the button text after 2 seconds
            setTimeout(() => {
                btn.textContent = originalText;
                btn.style.backgroundColor = ''; // Reset color
            }, 2000);
        })
        .catch(err => {
            console.error('Failed to copy text: ', err);
            alert('Could not copy link automatically. Please copy it from the address bar.');
        });
}
