var clientid = "1224"; // Your client id
var apikey = "b4f21e57-1923-4c83-bdb8-62d847d1357a"; // Your API Key
var creativeid = "";
var mediaid = "";

export default function SendVideoRequest(
  url,
  width,
  height,
  frameRate,
  duration,
  setDownloadStatus
) {
  upload_json_url();
  console.log(url);

  function upload_json_url() {
    console.log("start-upload_json_url");

    var data = new FormData();
    data.append("url", url);
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://html5animationtogif.com/api/uploadlottiejsonurl.ashx",
      true
    );
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (response.status == "success") {
        creativeid = response.creativeid;

        console.log("creativeid=" + creativeid);

        convert_video(creativeid);
      } else {
        alert(response.message);
      }
    };
    xhr.send(data);
  }

  // -- Convert Video --//

  function convert_video(id) {
    console.log("start-convert-video");
    var data = new FormData();
    data.append("clientid", clientid);
    data.append("apikey", apikey);
    data.append("creativeid", id);
    data.append("width", width);
    data.append("height", height);
    data.append("duration", `${duration / frameRate}`);
    data.append("fps", frameRate);
    data.append("audio", "N");
    data.append("webhookurl", "");
    // webhook url is a simple http web url (hosted on your server) which should accept "download url" as parameter from html5animationtogif.com, once output gets ready. Refer the document for more details.
    data.append("creativefitoption", "center");
    data.append("bitratevalue", "12");
    data.append("pixelformat", "YUV420P");
    data.append("bgcolor", "#ffffff"); // default background color white #ffffff
    var xhr = new XMLHttpRequest();
    xhr.open(
      "POST",
      "https://html5animationtogif.com/api/convertlottietovideo.ashx",
      true
    );
    xhr.onload = function () {
      var response = JSON.parse(xhr.responseText);
      if (response.status == "success") {
        mediaid = response.mediaid;
        console.log("Video " + mediaid + ".");
        //alert("Video " + mediaid + ".");

        // document.getElementById("rowResponse").style.display = "";

        WaitForOutput();
      } else {
        alert(response.message);
      }
    };
    xhr.send(data);
  }

  function WaitForOutput() {
    var xhr = new XMLHttpRequest();
    xhr.open(
      "GET",
      "https://html5animationtogif.com/api/checkstatus.ashx?creativeid=" +
        creativeid +
        "&mediaid=" +
        mediaid +
        "&fileext=mp4",
      true
    );

    xhr.onload = function () {
      console.log(xhr.responseText);
      setDownloadStatus(JSON.parse(xhr.responseText));
      var response = JSON.parse(xhr.responseText);

      if (response.status == "success") {
        if (response.jobstatus != "done") {
          window.setTimeout(WaitForOutput, 2000);
        } else if (response.jobstatus == "done") {
          // document.getElementById("rowRetry").style.display = "";
          window.open(response.url);
        }
      } else if (response.status == "error") {
        alert(response.message);
      }
    };
    xhr.send();
  }
}
