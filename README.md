# 🦕 DINO RUN - Minimal Edition

A modern, elegant take on the classic Chrome dinosaur game with stunning visuals, smooth 60fps gameplay, and progressive difficulty. Built with pure HTML5, CSS3, and JavaScript.

![Game Preview](https://img.shields.io/badge/Game-DINO%20RUN-green?style=for-the-badge&logo=javascript)
![Version](https://img.shields.io/badge/Version-1.0-blue?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

## ✨ Features

### 🎮 **Gameplay**
- **Smooth 60fps** performance with optimized game loop
- **Progressive difficulty** - speed increases every 100 points
- **Dynamic obstacles** - flying birds after 200 points
- **Realistic physics** with gravity and jump mechanics
- **Persistent high score** saved locally

### 🎨 **Visual Design**
- **Glassmorphism UI** with modern blur effects
- **Gradient backgrounds** and smooth animations
- **Realistic dinosaur** with detailed anatomy and textures
- **Particle effects** for jumps and collisions
- **Elegant italic typography** using JetBrains Mono

### 🕹️ **Controls**
- **SPACE** or **↑ Arrow** - Jump over obstacles
- **↓ Arrow** or **S** - Duck under flying birds
- **Click/Touch** - Mobile-friendly controls

## 🚀 Quick Start

### Play Online
Simply open `index.html` in any modern web browser - no installation required!

### Local Development
```bash
# Clone the repository
git clone https://github.com/DhanushDhayapulae/DINO-game.git

# Navigate to the project directory
cd DINO-game

# Open in your browser
open index.html
```

## 🎯 How to Play

1. **Start**: Press SPACE, ↑ arrow, or click to begin
2. **Jump**: Use SPACE or ↑ to jump over cacti 🌵
3. **Duck**: Use ↓ arrow or S to duck under birds 🦅
4. **Survive**: Avoid all obstacles to increase your score
5. **Challenge**: Birds start moving up and down after 200 points!

## 🏆 Scoring System

| Score Range | Difficulty | Features |
|-------------|------------|----------|
| 0-99 | Beginner | Base speed, static birds |
| 100-199 | Intermediate | 15% speed increase |
| 200-299 | Advanced | Flying birds + 30% speed |
| 300+ | Expert | Maximum speed + chaos mode |

## 🛠️ Technical Features

### Performance Optimizations
- **120fps input processing** for ultra-responsive controls
- **60fps rendering** for smooth visuals
- **Delta time calculations** for consistent frame rates
- **Efficient collision detection** with optimized hitboxes

### Modern Web Standards
- **Responsive design** - works on desktop, tablet, and mobile
- **ES6+ JavaScript** with clean, modular code structure
- **CSS Grid & Flexbox** for perfect layouts
- **LocalStorage** for persistent high scores

### Browser Compatibility
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Mobile browsers

## 🎨 Design Philosophy

This game reimagines the classic Chrome dinosaur with:

- **Minimalist aesthetics** - clean, uncluttered interface
- **Modern typography** - JetBrains Mono italic for elegance
- **Smooth animations** - 60fps with easing transitions
- **Glassmorphism** - contemporary UI design trends
- **Accessibility** - clear controls and visual feedback

## 📁 Project Structure

```
DINO-game/
├── index.html          # Main game page
├── style.css           # Modern CSS styling
├── script.js           # Game logic and mechanics
└── README.md          # This file
```

## 🔧 Customization

### Difficulty Settings
Modify these values in `script.js`:
```javascript
this.baseSpeed = 8;        // Initial game speed
this.jumpPower = 16;       // Jump height
this.gravity = 0.8;        // Gravity strength
```

### Visual Themes
Customize colors in `style.css`:
```css
:root {
  --primary-color: #667eea;
  --secondary-color: #764ba2;
  --dino-color: #2d5016;
}
```

## 🚀 Performance Tips

- **Optimal browser**: Chrome for best performance
- **Close tabs**: Reduce browser load for smoother gameplay
- **Full screen**: Press F11 for immersive experience
- **Hardware acceleration**: Enable in browser settings

## 🐛 Known Issues

- Minor lag on very old devices (pre-2018)
- Safari may have slight input delay on iOS < 14

## 🤝 Contributing

We welcome contributions! Please feel free to:

1. **Fork** the repository
2. **Create** a feature branch
3. **Commit** your changes
4. **Push** to the branch
5. **Open** a Pull Request

### Ideas for Contributions
- 🎵 Sound effects and background music
- 🌙 Dark/light theme toggle
- 🏅 Achievement system
- 🎯 Power-ups and special abilities
- 📱 Better mobile controls

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💻 Author

**Dhanush Dhayapulae**
- GitHub: [@DhanushDhayapulae](https://github.com/DhanushDhayapulae)

## 🙏 Acknowledgments

- Inspired by Google Chrome's offline dinosaur game
- Built with modern web technologies
- Designed for optimal user experience

---

<div align="center">

**⭐ Star this repository if you enjoyed the game! ⭐**

Made with ❤️ and lots of ☕

</div>
