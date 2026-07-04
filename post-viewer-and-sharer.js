// =================================================================//
// 1. MEDIA FILTER (Handles images and videos automatically) //
// =================================================================//
const renderer = new marked.Renderer();

renderer.image = function(href, title, text) {
  const fileUrl = href.toLowerCase();

  // Make sure if the file ends on a video format (.mp4, .mov or .webm)
  if (fileUrl.endsWith('.mp4') || fileUrl.endsWith('.mov') || fileUrl.endsWith('.webm')) {
    const fileExtension = href.split('.').pop().toLowerCase();
    
    // Apple/iOS: .mov needs 'quicktime' //
    const videoType = fileExtension === 'mov' ? 'quicktime' : fileExtension;

    return `
      <video controls preload="metadata">
        <source src="${href}" type="video/${videoType}">
        Your browser does not support playing this video file.
      </video>
    `;
  }
  
  // If it's a normal image file (.png or .jpg), return a normal image tag //
  return `<img src="${href}" alt="${text}" title="${title || ''}">`;
};

// Apply our filter settings in the Marked library //
marked.use({ renderer });

// =================================================================//
// 2. DECODER AND DYNAMIC TAB TITLE //
// =================================================================//
function loadSharedPost() {
  const container = document.getElementById('shared-content');
  try {
    // Reads everything that is after "?data=" in the browsers adress bar //
    const urlParams = new URLSearchParams(window.location.search);
    const base64Data = urlParams.get('data');

    if (!base64Data) {
      throw new Error("No post data found in the URL link!");
    }

    // Decodes the Base64 string back to a readable Markdown safely //
    const decodedMarkdown = decodeURIComponent(atob(base64Data));

    // EXTRACTING LOGIC FOR TITLE ON THE POST/SHARING PAGE //
    const lines = decodedMarkdown.split('\n');
    let sharedTitle = "Shared Post"; // Placeholder if no title is found //
    
    for (let line of lines) {
      if (line.trim().startsWith('#')) {
        // Removes the # and saves only the text to the title //
        sharedTitle = line.replace('#', '').trim();
        break;
      }
    }
    
    // Changes the name of the tab in the browser dynamically to the posts name //
    document.title = `Raman and Abodi's Channel Site | ${sharedTitle}`;

    // Converts Markdown to HTML and puts it in the centered viewport box //
    container.innerHTML = marked.parse(decodedMarkdown);

  } catch (error) {
    // Fallback if the post link would be broken or copied wrong //
    container.innerHTML = `<p style="color: red; font-weight: bold; text-align: center;">⚠️ Link Error: ${error.message}</p>`;
  }
}

// Easy help function for the copy to clipboard button //
function copyCurrentLink() {
  navigator.clipboard.writeText(window.location.href);
  alert("Share link copied to your clipboard!");
}

window.addEventListener('DOMContentLoaded', loadSharedPost);
