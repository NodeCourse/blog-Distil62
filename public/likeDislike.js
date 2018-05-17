const like = (id, alreadyVoted, likeOrDislike)=>{
    if (!alreadyVoted.split(",").includes(id.toString()))
    {
        var b = document.querySelector("#"+ likeOrDislike + id).textContent;
        b++;
        document.querySelector("#"+ likeOrDislike + id).textContent = b;

        let xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
            document.getElementById("demo").innerHTML = this.responseText;
            }
        };
        xhttp.open("POST", "/api/post/" + likeOrDislike + "/" + id, true);
        xhttp.send();

    }
}

