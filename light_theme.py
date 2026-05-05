import re

# Update styles.css
with open('d:\\Portfolio\\styles.css', 'r', encoding='utf-8') as f:
    css = f.read()

# Replace Root
root_new = """:root {
    --bg: #f4f7ff;
    --bg-2: #e2e8f0;
    --card-bg: rgba(255, 255, 255, 0.82);
    --text: #1e293b;
    --muted: #64748b;
    --accent: #0891b2;
    --accent2: #7c3aed;
    --accent3: #e11d64;
    --glass: rgba(0, 0, 0, 0.04);
    --border: rgba(8, 145, 178, 0.2);
    --border2: rgba(124, 58, 237, 0.2);
    --glow-c: rgba(8, 145, 178, 0.25);
    --glow-p: rgba(124, 58, 237, 0.25);
}"""
css = re.sub(r':root\s*\{[^\}]+\}', root_new, css, count=1)

# Body grid
css = css.replace('rgba(0, 245, 255, 0.03)', 'rgba(8, 145, 178, 0.08)')
# Navbar
css = css.replace('rgba(6, 10, 16, 0.7)', 'rgba(244, 247, 255, 0.8)')
css = css.replace('rgba(13, 18, 32, 0.85)', 'rgba(255, 255, 255, 0.82)')

# primary btn text
css = css.replace('color: #000;', 'color: #fff;')

# Background colors of the cards and other dark elements
css = css.replace('background: #0d1220;', 'background: #e2e8f0;')

with open('d:\\Portfolio\\styles.css', 'w', encoding='utf-8') as f:
    f.write(css)


# Update script.js
with open('d:\\Portfolio\\script.js', 'r', encoding='utf-8') as f:
    js = f.read()

js = js.replace('0x00f5ff', '0x0891b2')
js = js.replace('0x7b2fff', '0x7c3aed')
js = js.replace('0xff3cac', '0xe11d64')

# Fix core glow
js = js.replace('color: 0x0891b2, emissive: 0x0891b2', 'color: 0x67e8f9, emissive: 0x67e8f9')

# Fix crystal body
crystal_old = """const heroMat = new THREE.MeshStandardMaterial({
        color: 0x0d1220,
        metalness: 0.9,
        roughness: 0.1,
        wireframe: false,
    });"""
crystal_new = """const heroMat = new THREE.MeshStandardMaterial({
        color: 0xe8f4ff,
        metalness: 0.3,
        roughness: 0.1,
        wireframe: false,
        transparent: true,
        opacity: 0.55
    });"""
js = js.replace(crystal_old, crystal_new)

# Fix navbar scroll
js = js.replace("'rgba(6,10,16,0.95)'", "'rgba(244, 247, 255, 0.95)'")
js = js.replace("'rgba(6,10,16,0.7)'", "'rgba(244, 247, 255, 0.8)'")

with open('d:\\Portfolio\\script.js', 'w', encoding='utf-8') as f:
    f.write(js)

print("Done")
