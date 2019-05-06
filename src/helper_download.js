/**
Triggers a download of `data` using the provided filename.
Encapulates some browser-specific API differences.

@param {string} filename The filename to use.
@param {string} data The data to be saved.
@returns {undefined}
*/
function downloadData(filename, data) {
    if (typeof(window.navigator.msSaveBlob) === "function") {
        const blob = new Blob([data], {
            type: "text/plain"
        });
        window.navigator.msSaveBlob(blob, filename);
        return;
    }
    if ("download" in document.createElement("a") && navigator.userAgent.toLowerCase().indexOf("firefox") === -1) { //So far only chrome AND not firefox.
        const downloadLink = document.createElement("a");
        downloadLink.download = filename;
        downloadLink.href = window.URL.createObjectURL(new Blob([data], {
            type: "text/plain"
        }));
        downloadLink.click();
        window.URL.revokeObjectURL(downloadLink.href); //Release object: https://developer.mozilla.org/en-US/docs/Web/API/URL.revokeObjectURL
        return;
    }
    window.location.href = "data:application/x-download;charset=utf-8," + encodeURIComponent(data);
}
