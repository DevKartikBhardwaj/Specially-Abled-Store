
# Specially Abled Store

**Specially Abled Store** is a voice-enabled web application designed to empower blind and visually impaired individuals to shop online independently. It integrates cutting-edge technologies like voice interaction and WebAuthn-based authentication to create a secure, screen-free shopping experience.

---

## Features

- **Voice-Enabled Shopping**  
  Built using `react-speech-kit`, the application allows users to navigate and shop using voice commands without relying on visual interfaces.

- **Secure, Screen-Free Authentication**  
  Uses `WebAuthn`, a public-key cryptography-based authentication protocol, to provide secure and passwordless login—perfect for screen-free accessibility.

- **Accessible UX Design**  
  Designed specifically for users with visual impairments, focusing on clarity, simplicity, and non-visual interaction.

---

## Impact

Aims to support over **285 million visually impaired individuals worldwide** by promoting autonomy in daily tasks like online shopping—making technology inclusive for all.

---

## Tech Stack

- **Frontend**: React.js, React Speech Kit  
- **Authentication**: WebAuthn (FIDO2 Standard)  
- **Backend**: Node.js, Express.js  
- **Database**: MongoDB  
- **Other**: JWT, HTML5, ARIA roles for accessibility

---

## Installation

### Prerequisites

- Node.js
- npm or yarn
- MongoDB (local or cloud)

### Steps

```bash
# Clone the repository
git clone https://github.com/DevKartikBhardwaj/Specially-Abled-Store.git
cd Specially-Abled-Store

# Install dependencies
npm install

# Setup environment variables
cp .env.example .env
# Edit .env with your configuration

# Run the app
npm start
```

---

## Folder Structure

```
Specially-Abled-Store/
├── client/             # Frontend - React app
├── server/             # Backend - Node/Express API
├── public/             
├── .env.example        
├── README.md           
```

---

## Future Improvements

- Multilingual voice support  
- Product recommendations via voice  
- Integration with screen readers (e.g., NVDA, JAWS)

---

## Contributing

Contributions are welcome! Please open an issue or submit a pull request for any enhancements or bug fixes.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Contact

**Author:** Kartik Bhardwaj  
**Email:** kartikbhardwaj.coer@gmail.com  
**GitHub:** [DevKartikBhardwaj](https://github.com/DevKartikBhardwaj)
