const v103 = function () {
    const lastUsername = localStorage.getItem('lastUsername');
    if (lastUsername) {
        const v53 = document.querySelector('input[name="username"]');
        v53.value = lastUsername;
    }
    const displayUserInfo = function (username) {
        const userInfoDiv = document.createElement('div');
        userInfoDiv.innerHTML = `Welcome back, ${ username }!`;
        const v54 = document.querySelector('.navbar-nav');
        const v55 = v54.prepend(userInfoDiv);
        v55;
    };
    const fetchMoviePoster = async function (url) {
        try {
            const response = await fetch(url);
            const blob = await response.blob();
            const v56 = URL.createObjectURL(blob);
            return v56;
        } catch (error) {
            const v57 = console.error('Error fetching poster:', error);
            v57;
            return null;
        }
    };
    const loadMoviePoster = function (path) {
        const img = document.createElement('img');
        img.src = path;
        return img;
    };
    const movieCards = document.querySelectorAll('.movie-card');
    const v66 = card => {
        const v60 = function () {
            const v58 = this.style;
            v58.transform = 'scale(1.05)';
            const v59 = this.style;
            v59.zIndex = '1';
        };
        const v61 = card.addEventListener('mouseenter', v60);
        v61;
        const v64 = function () {
            const v62 = this.style;
            v62.transform = 'scale(1)';
            const v63 = this.style;
            v63.zIndex = '0';
        };
        const v65 = card.addEventListener('mouseleave', v64);
        v65;
    };
    const v67 = movieCards.forEach(v66);
    v67;
    const v68 = document.querySelectorAll('a[href^="#"]');
    const v75 = anchor => {
        const v73 = function (e) {
            const v69 = e.preventDefault();
            v69;
            const v70 = this.getAttribute('href');
            const target = document.querySelector(v70);
            if (target) {
                const v71 = {
                    behavior: 'smooth',
                    block: 'start'
                };
                const v72 = target.scrollIntoView(v71);
                v72;
            }
        };
        const v74 = anchor.addEventListener('click', v73);
        v74;
    };
    const v76 = v68.forEach(v75);
    v76;
    const parseMovieXML = function (xmlString) {
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlString, 'text/xml');
        return xmlDoc;
    };
    const forms = document.querySelectorAll('form');
    const v90 = form => {
        const v88 = function (e) {
            const requiredFields = form.querySelectorAll('[required]');
            let isValid = true;
            const v84 = field => {
                const v77 = field.value;
                const v78 = v77.trim();
                const v79 = !v78;
                if (v79) {
                    isValid = false;
                    const v80 = field.classList;
                    const v81 = v80.add('is-invalid');
                    v81;
                } else {
                    const v82 = field.classList;
                    const v83 = v82.remove('is-invalid');
                    v83;
                }
            };
            const v85 = requiredFields.forEach(v84);
            v85;
            const v86 = !isValid;
            if (v86) {
                const v87 = e.preventDefault();
                v87;
            }
        };
        const v89 = form.addEventListener('submit', v88);
        v89;
    };
    const v91 = forms.forEach(v90);
    v91;
    const loadUserProfile = function (userId) {
        const v92 = `/api/user/${ userId }`;
        const v93 = fetch(v92);
        const v95 = response => {
            const v94 = response.json();
            return v94;
        };
        const v96 = v93.then(v95);
        const v98 = data => {
            const v97 = console.log(data);
            v97;
        };
        const v99 = v96.then(v98);
        const v101 = error => {
            const v100 = console.error('Error:', error);
            return v100;
        };
        const v102 = v99.catch(v101);
        v102;
    };
};
const v104 = document.addEventListener('DOMContentLoaded', v103);
v104;