const urlParams = new URLSearchParams(window.location.search);
const base64Data = urlParams.get('data');
const container = document.getElementById('postContainer');

if (base64Data) {
    try {
        const binaryStr = atob(base64Data);
        const bytes = Uint8Array.from(binaryStr, char => char.charCodeAt(0));
        const fullText = new TextDecoder().decode(bytes);

        const rows = fullText.split('\n');
        let folderName = "";
        container.innerHTML = ""; 

        rows.forEach((row) => {
            const trimmedRow = row.trim();
            if (!trimmedRow) return;

            // Handle Post Title, Tab Matching, and Folder Formatting
            if (trimmedRow.startsWith('#')) {
                const titleText = trimmedRow.replace('#', '').trim();
                
                // Updates the browser window tab title layout structure dynamically
                document.title = `Site name | ${titleText}`;
                
                folderName = titleText.toLowerCase()
                                      .replace(/[^a-z0-9\s-]/g, '') 
                                      .replace(/\s+/g, '-')         
                                      .replace(/-+/g, '-')          
                                      .trim();
                
                const h1 = document.createElement('h1');
                h1.textContent = titleText;
                container.appendChild(h1);
                return;
            }

            const fileMatch = trimmedRow.match(/\("\*(.*?)\*"\)/);
            
            if (fileMatch) {
                const target = fileMatch; 
                
                if (target.startsWith('http://') || target.startsWith('https://')) {
                    const linkBtn = document.createElement('a');
                    linkBtn.href = target;
                    linkBtn.className = 'download-link'; 
                    linkBtn.target = '_blank';           
                    linkBtn.rel = 'noopener noreferrer'; 
                    linkBtn.textContent = `🌐 Visit ${target.replace('https://', '').replace('www.', '')}`;
                    container.appendChild(linkBtn);
                } 
                else {
                    const ext = target.split('.').pop().toLowerCase();
                    const filePath = `${folderName}/${target}`;

                    if (ext === 'txt') {
                        const txtBox = document.createElement('div');
                        txtBox.className = 'txt-file-content';
                        txtBox.textContent = `Fetching content from: ${filePath}...`;
                        container.appendChild(txtBox);

                        fetch(filePath)
                            .then(response => {
                                if (!response.ok) throw new Error();
                                return response.text();
                            })
                            .then(textData => { txtBox.textContent = textData; })
                            .catch(() => {
                                txtBox.textContent = `⚠️ Text file could not be found at: ${filePath}`;
                                txtBox.style.borderLeftColor = "#dc3545";
                            });
                    } 
                    else if (['png', 'jpg', 'jpeg', 'webp', 'gif'].includes(ext)) {
                        const img = document.createElement('img');
                        img.src = filePath;
                        img.alt = target;
                        container.appendChild(img);
                    } 
                    else if (['mp4', 'webm', 'mov'].includes(ext)) {
                        const video = document.createElement('video');
                        video.src = filePath;
                        video.controls = true; 
                        container.appendChild(video);
                    } 
                    else if (['mp3', 'wav', 'ogg'].includes(ext)) {
                        const audio = document.createElement('audio');
                        audio.src = filePath;
                        audio.controls = true;
                        container.appendChild(audio);
                    } 
                    else {
                        const a = document.createElement('a');
                        a.href = filePath;
                        a.className = 'download-link';
                        a.download = target;
                        a.textContent = `⬇️ Download ${target}`;
                        container.appendChild(a);
                    }
                }
            } 
            else {
                const p = document.createElement('p');
                p.textContent = trimmedRow;
                container.appendChild(p);
            }
        });

    } catch (error) {
        container.textContent = "Error parsing post data string.";
        console.error(error);
    }
} else {
    container.textContent = "No post data query found in URL.";
}
