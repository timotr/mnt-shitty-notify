/*
Kleebid kogu selle faili sisu browseri konsooli (F12 -> Console) olles sellel kalendri vaatega lehel.
Kood vajutab iga 2 minuti tagant sellele "Kus saab kõige kiiremini eksamile?" ja võrdleb avaneva akna tulemust eelmisega.
Kui on erinev teeb browser notificationi mis tuleb ka OS'is kella kõrvale (kui annad permissioni esimesel käivitamisel)
Kui oled teisel tabil või browser minimized siis ei saa garanteerida, et power saver javascripti pausile ei pane.
*/

aTags = document.getElementsByTagName("a");
searchText = "Kus saab kõige kiiremini eksamile?";
found = null;
eelmine = "";

for (var i = 0; i < aTags.length; i++) {
  if (aTags[i].textContent == searchText) {
    found = aTags[i];
    break;
  }
}

if(typeof vaataUuestiInterval !== "undefined")
  clearInterval(vaataUuestiInterval);
if(found) {
  vaataUuestiInterval = setInterval(vaataUuesti, 120*1000)

  targetNode = document.getElementById('some-id');
  config = { attributes: false, childList: true, subtree: true };
  observer = new MutationObserver(function(mutationsList, observer) {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.target.id === "varaseimadEksamiajadForm") {
            //console.log(mutation.target.querySelectorAll("li"));
            let text = mutation.target.textContent;
            if(text !== eelmine) {
               console.log("On muutus");
               eelmine = text;
               let ajad = "Muudatus:";
               mutation.target.querySelectorAll("li").forEach(aeg => {ajad+="\n"+aeg.textContent.trim().replace(/\s\s+/g, ' ')});

    Notification.requestPermission().then(function (permission) {
      // If the user accepts, let's create a notification
      if (permission === "granted") {
        var notification = new Notification( ajad );
      }
    });

             } else {console.log("ei olnud muutust");}
        }
    }
  });
  observer.observe(document.body, config);
  found.click();
}

function vaataUuesti() {
  if(found) {found.click();console.log("vaatan uuesti");}
}
