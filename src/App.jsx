import { useEffect, useRef } from 'react';
import * as THREE from 'three';

function App() {
  const mountRef = useRef(null);

  useEffect(() => {
    if (!mountRef.current) return;

    // 1. สร้าง Scene และสีพื้นหลัง
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#F5F3EC');
    
    // 2. สร้าง Camera
    const camera = new THREE.PerspectiveCamera(
      45, 
      mountRef.current.clientWidth / mountRef.current.clientHeight, 
      0.1, 
      1000
    );
    
    // 3. สร้าง Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    
    // เคลียร์ Canvas เก่าก่อน (ป้องกันการซ้อนทับเวลา React ทำ Hot Reload)
    if (mountRef.current.children.length > 0) {
      mountRef.current.removeChild(mountRef.current.children[0]);
    }
    mountRef.current.appendChild(renderer.domElement);

    // 4. สร้างโมเดล 3D ชุมชนจำลอง (กล่องหลัก)
    const geometry = new THREE.BoxGeometry(2, 2, 2);
    const material = new THREE.MeshStandardMaterial({ 
      color: '#173C32',
      roughness: 0.8,
      metalness: 0.2
    });
    const cube = new THREE.Mesh(geometry, material);
    
    // สร้างหลังคา
    const roofGeometry = new THREE.ConeGeometry(1.8, 1, 4);
    const roofMaterial = new THREE.MeshStandardMaterial({ color: '#B8755A' });
    const roof = new THREE.Mesh(roofGeometry, roofMaterial);
    roof.position.y = 1.5;
    roof.rotation.y = Math.PI / 4;
    
    // รวมร่างโมเดล
    const building = new THREE.Group();
    building.add(cube);
    building.add(roof);
    scene.add(building);

    // 5. จัดแสง
    const light = new THREE.DirectionalLight(0xffffff, 1.2);
    light.position.set(5, 10, 7);
    scene.add(light);
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    // 6. ตั้งมุมกล้องแบบ Isometric
    camera.position.set(6, 5, 6);
    camera.lookAt(0, 0, 0);

    // 7. แอนิเมชันหมุนโมเดล
    const animate = () => {
      requestAnimationFrame(animate);
      building.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    // 8. การจัดการเมื่อเปลี่ยนขนาดหน้าจอ
    const handleResize = () => {
      if (!mountRef.current) return;
      camera.aspect = mountRef.current.clientWidth / mountRef.current.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(mountRef.current.clientWidth, mountRef.current.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (mountRef.current && renderer.domElement) {
        mountRef.current.removeChild(renderer.domElement);
      }
      geometry.dispose();
      material.dispose();
      renderer.dispose();
    };
  }, []);

  return (
    <>
      <nav className="nav-bar">
        <div className="nav-brand">
          NÉRA <span className="demo-badge">DEMO</span>
        </div>
        <div className="nav-links">
          <a href="#overview">Overview</a>
          <a href="#community">Community</a>
        </div>
      </nav>

      <section className="hero-section" id="overview">
        <div className="hero-text">
          <h1>ชุมชนที่เข้มแข็ง<br/>เริ่มต้นจากการเชื่อมโยง</h1>
          <p>แพลตฟอร์มที่รวบรวมศักยภาพของชุมชน เพื่อส่งเสริมเศรษฐกิจท้องถิ่นและการพัฒนาอย่างยั่งยืนผ่านประสบการณ์ 3D Interactive</p>
          <div>
            <button className="btn">สำรวจชุมชน</button>
          </div>
        </div>
        <div className="hero-3d" ref={mountRef}></div>
      </section>
    </>
  );
}

export default App;
