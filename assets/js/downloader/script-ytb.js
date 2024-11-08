document.getElementById('search-btn').addEventListener('click', function () {
    const videoUrlInput = document.getElementById('video-url').value.trim();
    const searchBtn = document.getElementById('search-btn');
    const searchBtnText = document.getElementById('search-btn-text');
    const searchBtnSpinner = document.getElementById('search-btn-spinner');
    const videoDetails = document.getElementById('video-details');
    const thumbnail = document.getElementById('video-thumbnail');
    const thumbnailSpinner = document.getElementById('thumbnail-spinner');

    if (!videoUrlInput) {
        alert('Veuillez entrer une URL de vidéo.');
        return;
    }

    // Afficher le spinner dans le bouton et désactiver le bouton
    searchBtnText.classList.add('d-none');
    searchBtnSpinner.classList.remove('d-none');
    searchBtn.disabled = true;

    // Masquer les détails de la vidéo
    videoDetails.classList.add('d-none');

    fetch('/downloader/get-video-info', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: videoUrlInput }),
    })
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur HTTP : ' + response.status);
            }
            return response.json();
        })
        .then(data => {
            searchBtnText.classList.remove('d-none');
            searchBtnSpinner.classList.add('d-none');
            searchBtn.disabled = false;

            if (data.success) {
                videoDetails.classList.remove('d-none');
                thumbnail.style.display = 'none';
                thumbnailSpinner.classList.remove('d-none');

                document.getElementById('video-title').textContent = data.title;

                thumbnail.onload = function() {
                    thumbnailSpinner.classList.add('d-none');
                    thumbnail.style.display = 'block';
                };

                thumbnail.onerror = function() {
                    thumbnailSpinner.classList.add('d-none');
                    alert('Erreur lors du chargement de la miniature.');
                };

                thumbnail.src = data.thumbnail;

                document.getElementById('download-btn').onclick = function () {
                    window.location.href = `/downloader/download-video?url=${encodeURIComponent(videoUrlInput)}`;
                };
            } else {
                alert(data.message + '\n' + (data.error || ''));
            }
        })
        .catch(error => {
            searchBtnText.classList.remove('d-none');
            searchBtnSpinner.classList.add('d-none');
            searchBtn.disabled = false;

            console.error('Erreur:', error);
            alert('Une erreur est survenue : ' + error.message);
        });
});
