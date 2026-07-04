// =================================================================//
// 1. MEDIA FILTER (Handles images and videos automatically)//
// =================================================================//
const renderer = new marked.Renderer();

renderer.image = function(href, title, text) {
  const fileUrl = href.toLowerCase();

  // Filter to fetch videos (.mp4, .mov or .webm) //
  if (fileUrl.endsWith('.mp4') || fileUrl.endsWith('.mov') || fileUrl.endsWith('.webm')) {
    const fileExtension = href.split('.').pop().toLowerCase();
    
    // For Apple/iOS: .mov-files need 'quicktime' as format type in the browser //
    const videoType = fileExtension === 'mov' ? 'quicktime' : fileExtension;

    return `
      <video controls preload="metadata">
        <source src="${href}" type="video/${videoType}">
        Your browser does not support playing this video file.
      </video>
    `;
  }
  
  // If it's a normal image file (.png, .jpg), return a normal image tag //
  return `<img src="${href}" alt="${text}" title="${title || ''}">`;
};

// Connect our custom media rules directly to the Marked library //
marked.use({ renderer });

// =================================================================//
// 2. Automatic generation of button of a post and selection of title //
// =================================================================//
async function autoGeneratePostButton() {
  const container = document.getElementById('news-post');
  
  try {
    // 1. Gets the Markdown file //
    const response = await fetch('post1.md');
    if (!response.ok) throw new Error('Could not load post1.md file');
    
    const markdownText = await response.text();

    // 2. Finding the title: Goes through the rows and searches for the first that starts with '#' //
    const lines = markdownText.split('\n');
    let postTitle = "View Latest Post"; // Placeholder name if no '#' is found / 
    
    for (let line of lines) {
      if (line.trim().startsWith('#')) {
        // Remove the # and any spaces to only get the text //
        postTitle = line.replace('#', '').trim();
        
        // Dynamic Tab title: Changes the name of this site's tab in the browser to the post's title //
        document.title = `Channel Site | ${postTitle}`;
        break; 
      }
    }

    // 3. BASE64 ENCODING: Turn all that is in the markdown file to a Base64 string //
    const base64Id = btoa(encodeURIComponent(markdownText));

    // 4. GENERATE URL: Safe link structure with "?" that works with no problem on GitHub Pages //
    const targetUrl = `post.html?data=${base64Id}`;

    // 5. CREATE A BUTTON: Creates your link button that automatically inherits the cool styles from styles.css (Yes i call the styles cool) //
    container.innerHTML = `
      <a href="${targetUrl}" class="linktitle">${postTitle}</a>
    `;

  } catch (error) {
    // Fallback if the file is not found, so the site doesn't crash to 0 pixels //
    container.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">⚠️ Automation Error: ${error.message}</p>`;
  }
}

// =================================================================
// 3.THE LOGIC
// =================================================================
window.addEventListener('DOMContentLoaded', autoGeneratePostButton);
