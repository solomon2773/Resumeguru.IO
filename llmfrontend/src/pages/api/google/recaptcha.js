import axios from 'axios';

export default async function handler(req, res) {
    const { token, ...formData } = JSON.parse(req.body);
    if (!token) {
        return res.status(400).json({ success: false, message: 'Token is missing' });
    }

    try {
        const response = await axios.post(`https://www.google.com/recaptcha/api/siteverify?secret=${process.env.RECAPTCHA_SECRET_KEY}&response=${token}`);
        const data = response.data;
        if (data.success) {
            // Process the form data here (e.g., send email)
            res.status(200).json({ success: true, data });
        } else {
            res.status(400).json({ success: false, message: 'reCAPTCHA verification failed' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Server error' });
    }
}
