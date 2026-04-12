document.addEventListener("DOMContentLoaded", function() {
    // Select the footer element
    const footer = document.getElementById('footer');
    const folder = document.getElementById('root-folder').getAttribute('value');

    // Define the content you want to add
    const footerContent = `
        <footer class="footer"> 
        
        <div class="footer-contacts" >
        <a href="mailto:federico.bruzzone.i@gmail.com">                                <img src="[FOLDER]/icons/gmail.svg"     width=40px height=40px> </a>
        <a href="https://x.com/fedebruzzone7">                                             <img src="[FOLDER]/icons/X.svg"         width=40px height=40px> </a>
        <a href="https://github.com/FedericoBruzzone">                                    <img src="[FOLDER]/icons/github.svg"    width=40px height=40px> </a>
        <a href="https://www.linkedin.com/in/federico-bruzzone/">                          <img src="[FOLDER]/icons/linkedin.svg"  width=40px height=40px> </a>
        <a href="https://t.me/federicobruzzone">                                         <img src="[FOLDER]/icons/telegram.svg" width=40px height=40px> </a>
        <a href="https://www.reddit.com/user/FedericoBruzzone/">                          <img src="[FOLDER]/icons/reddit.svg"    width=40px height=40px> </a>
        </div>

        </footer>
    `.replaceAll("[FOLDER]",folder);

    footer.innerHTML = footerContent;
});
