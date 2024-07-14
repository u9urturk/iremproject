import * as Yup from "yup";

Yup.setLocale({
    mixed: {
        required: "Bu alan zorunludur !"
    },
    string: {
        email: "Email girilmelidir !"
    }
})


export default Yup;