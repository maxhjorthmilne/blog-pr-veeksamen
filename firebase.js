import { initializeApp } from 'firebase/app'
import "firebase/auth";
import {
    getFirestore, collection, getDocs,
    addDoc, query, where, onSnapshot, doc, deleteDoc
} from 'firebase/firestore'
import {
    getAuth,
    createUserWithEmailAndPassword,
    signOut,
    signInWithEmailAndPassword

} from "firebase/auth"


const firebaseConfig = {
    apiKey: "AIzaSyD0nNUiiCRt9xiKSj2SlEveqorLnL04ZxM",
    authDomain: "bloggside-79f7d.firebaseapp.com",
    projectId: "bloggside-79f7d",
    storageBucket: "bloggside-79f7d.appspot.com",
    messagingSenderId: "335995574534",
    appId: "1:335995574534:web:0d5b142db93f50e5556687"
};


// init firebase
initializeApp(firebaseConfig)

// init services
const db = getFirestore()
const auth = getAuth()
// collection ref
const colRef = collection(db, 'blogs')

const colRefCom = collection(db, "comments")
//veilderer link ref
const veileder = document.querySelector(".veileder")
//query
const q = query(colRef, where("author", "==", "max05hm@gmail.com"));

//user collection ref
const userColRef = collection(db, "user")
//form login ref
const login = document.querySelector(".login")
//form blogg ref
const formwrapper = document.querySelector(".form-wrapper")
const page2 = document.querySelector(".page2")
let cred = localStorage.getItem("user")
//remove blogg ref
const removeBlogg = document.querySelector(".delete")

//html refferences
const parentElement = document.getElementById('parent');
const allBloggsElement = document.querySelector(".allBloggs")


//display specific to user bloggs
getDocs(colRef)
    .then((snapshot) => {
        let blogs = [];
        snapshot.docs.forEach((doc) => {
            blogs.push({ ...doc.data(), id: doc.id });
            if (cred === doc.data().forfatter) {
                let item = doc.data();

                const newDiv = document.createElement('div');


                newDiv.classList.add("blog")
                newDiv.innerHTML += `<div>
        <br>tittel: ${doc.data().tittel}
        <br>innhold: ${doc.data().tekst}
        <br>forfatter: ${doc.data().forfatter}
        </div>`;

                let commentDiv = document.createElement("div");
                commentDiv.classList.add("comment-container");


                let input = document.createElement("input")
                input.classList.add("comment-input")
                input.setAttribute("type", "text")
                input.setAttribute("name", "commentContent")
                input.setAttribute("required", "")
                commentDiv.appendChild(input)

                let submitComment = document.createElement("button")
                submitComment.classList.add("comment-submit")
                submitComment.innerText = "Submit Comment"
                commentDiv.appendChild(submitComment)


            // Adding comment
            submitComment.addEventListener("click", (e) => {
                e.preventDefault()
                addDoc(colRefCom, {
                    commentContent: input.value,
                    blogID: item.bloggID
                })
                .then(() => {
                    input.value = "";
                    console.log("Comment Added")
                    location.reload()
                })
                .catch((err) => {
                    console.log(err.message)
                })
            })
                //getting comments
                getDocs(colRefCom)
                    .then((snapshot) => {
                        snapshot.docs.forEach(doc => {
                            let commentItem = doc.data();

                            if (commentItem.blogID === item.bloggID) {
                                let commentp = document.createElement("p");
                                commentp.classList.add("comment-p")
                                commentp.innerText = `Comment: ${commentItem.commentContent}`
                                commentDiv.appendChild(commentp)

                            }
                        })
                    })

                parentElement.appendChild(newDiv);
                newDiv.appendChild(commentDiv)
            }
        })

    })
    .catch(err => {
        console.log(err.message);
    })



//logg in
login.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = login.username.value
    const password = login.password.value
    console.log(email, password)
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            login.reset();
            console.log("user logged in:", cred.user);
            localStorage.setItem("user", cred.user.email)
            formwrapper.classList.add("d-none")
            page2.classList.remove("d-none");
            removeBlogg.classList.remove("d-none");
            location.reload();
        })
        .catch((err) => {
            console.log(err.message)
        })
})




//check if user is logged in and stay "logged in"

document.addEventListener("DOMContentLoaded", (e) => {
    let user = localStorage.getItem("user");
    if (user) {
        formwrapper.classList.add("d-none")
        page2.classList.remove("d-none");
        removeBlogg.classList.remove("d-none");
    }
})



//logout 
const logoutBtn = document.querySelector(".logout")
logoutBtn.addEventListener("click", (e) => {
    signOut(auth)
        .then(() => {
            console.log("the user is logged out")
            localStorage.removeItem("user")
            formwrapper.classList.remove("d-none")
            page2.classList.add("d-none");
            removeBlogg.classList.add("d-none");
            location.reload();
        })
        .catch((err) => {
            console.log(err.message)
        })
})





//add blogg
const addBloggs = document.querySelector(".page2")
addBloggs.addEventListener("submit", (e) => {
    e.preventDefault();
    addDoc(colRef, {
        tittel: addBloggs.tittel.value,
        tekst: addBloggs.tekst.value,
        forfatter: addBloggs.forfatter.value,
        bloggID: addBloggs.bloggID.value,
    })
        .then(() => {
            addBloggs.reset()
            location.reload();
        })

})



//register user
const addUser = document.querySelector(".addUser")
addUser.addEventListener("submit", (e) => {
    e.preventDefault();
    const email = addUser.username.value
    const password = addUser.password.value

    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            console.log("user added" + cred.user)
            addUser.reset();
        })
        .catch((err) => {
            console.log(err.message)
        })
})


//check if admin and add route to "veileder"

if (cred === "max05hm@gmail.com") {
    console.log("this is admin")
    veileder.classList.remove("d-none");


}





//delete blogg but i need ID //have to reload to see

removeBlogg.addEventListener("submit", (e) => {
    e.preventDefault()
    const docRef = doc(db, "blogs", removeBlogg.bloggID.value)
    deleteDoc(docRef)
        .then(() => {
            removeBlogg.reset()
            console.log("Object Deleted")
        })
})








