import { Layout, Menu, Button, Row, Col, Card, Typography } from "antd";
import {
  BookOutlined,
  AudioOutlined,
  TeamOutlined,
  BulbOutlined,
} from "@ant-design/icons";
import 'antd/dist/reset.css';
import LandingPic from '../assets/landingPic.jpg';
import aboutUs from '../assets/aboutUs.jpg';
import { useNavigate } from "react-router-dom";
import { COLORS } from "../constants/colors";
import Logo from "../components/logo";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;
const handleMenuClick = (e: { key: string; }) => {
  const section = document.getElementById(e.key.toLowerCase());
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
};

const LandingPage = () => {
  const navigate = useNavigate();
  const programs = [
    {
      title: "Grammar Rules",
      description: "Learn key rules to form accurate sentences and improve skills.",
      icon: <BookOutlined style={{ fontSize: 50, color: "#7ca7e6" }} />,
      bg: "#e8f5e9",
    },
    {
      title: "Speaking Practice",
      description: "Practice real dialogues to improve fluency and build confidence.",
      icon: <TeamOutlined style={{ fontSize: 50, color: "#e07a7a" }} />,
      bg: "#fdeaea",
    },
    {
      title: "Vocabulary Building",
      description: "Expand your word bank with new terms for daily communication.",
      icon: <BulbOutlined style={{ fontSize: 50, color: "#74b9ff" }} />,
      bg: "#eaf3fd",
    },
    {
      title: "Listening Skills",
      description: "Enhance comprehension through audio exercises with accents.",
      icon: <AudioOutlined style={{ fontSize: 50, color: "#f8b400" }} />,
      bg: "#fff8e1",
    },
  ];
  
  return (
    <Layout  style={{ minHeight: "100vh", background: "#fff" ,width: "100%",paddingTop: "2000px"  }}>
      <Header style={{backgroundColor: "white", display: "flex", justifyContent: "space-between", top: 0,alignItems: "center",position: "sticky", zIndex: 1000,
          height: "64px", }}>
        <Logo></Logo>
        
        <Menu
          mode="horizontal"
          onClick={handleMenuClick}
          items={[
            { key: "home", label: "Home" },
            { key: "programs", label: "Program" },
            { key: "about", label: "About" },
            { key: "contact", label: "Contact" },
          ]}
        />
        <div style={{ display: "flex", gap: "10px" }}>
          <Button style={{backgroundColor:COLORS.primary}}  type="primary" onClick={() => navigate("/signup")}>Sign up</Button>
          <Button style={{ marginRight: 10, color:"#9AB7D0", borderColor:"#9AB7D0"}} onClick={() => navigate("/login")}>Login</Button>
        </div>
      </Header>
      <Content style={{ padding: "80px 50px" }}>
        <section id="home">
          <Row align="middle" gutter={80}>
            {/* Text Section */}
            <Col xs={24} md={12}>
              <div>
                <Title
                  level={2}
                  style={{
                    fontWeight: 800,
                    lineHeight: 1.2,
                    color: "#000",
                    marginBottom: 20,
                  }}
                >
                  Professional English <br /> Course Designed For <br /> Your
                  Growth
                </Title>
                <Paragraph style={{ color: "#555", fontSize: 16, marginBottom: 30 }}>
                  Learn English easily with our website. Fun lessons and
                  practical exercises to help you improve every day.
                </Paragraph>
                <Button
                  type="primary"
                  size="large"
                  style={{
                    backgroundColor: "#9AB7D0",
                    borderRadius: 6,
                    padding: "8px 25px",
                    fontWeight: 500,
                  }}
                  onClick={
                    
                    () => navigate("/signup")
                  }
                >
                  Start your journey now
                </Button>
              </div>
            </Col>

            {/* Image Section */}
            <Col xs={24} md={12} style={{ textAlign: "center" }}>
              <img
                src={LandingPic}
                alt="Student studying English"
                style={{
                  height:"561px",
                  maxWidth: "520px",
                  borderRadius: "10px",
                  padding:"50px",
                }}
              />
            </Col>
          </Row>
          {/* --- TRUSTED BY SECTION --- */}
        <div
          style={{
            backgroundColor: "#F5FAFF",
            padding: "70px 0",
            width: "100%",

          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-evenly",
              alignItems: "center",
              maxWidth: "1200px",
              margin: "0 auto",
              flexWrap: "wrap",
              textAlign: "center",
              gap: "20px",
            }}
          >
            {["Zoom", "Udemy", "Microsoft", "Codecs", "User Testing"].map(
              (brand, index) => (
                <div key={index} style={{ flex: 1, minWidth: "150px" }}>
                  <strong style={{ fontSize: 18, color: "#000" }}>{brand}</strong>
                </div>
              )
            )}
          </div>
        </div>
      </section>
      {/* ===== OUR PROGRAMS SECTION ===== */}
      <section id="programs">
          <div
            style={{width: "100%",

              padding: "80px 0",
              backgroundColor: "#fff",
              textAlign: "center",
            }}
          >
            <Title level={3} style={{ marginBottom: 50 }}>
              Our Programs
            </Title>

            <Row
              gutter={[24, 24]}
              justify="center"
              style={{
                maxWidth: "1200px",
                margin: "0 auto",
                width: "100%",
              }}
            >
              {programs.map((program, index) => (
                <Col key={index} xs={24} sm={12} md={6}>
                  <Card
                    bordered={false}
                    style={{
                      backgroundColor: program.bg,
                      borderRadius: 16,
                      padding: 20,
                      height: "100%",
                    }}
                  >
                    <div style={{ marginBottom: 20 }}>{program.icon}</div>
                    <Title level={5}>{program.title}</Title>
                    <Paragraph>{program.description}</Paragraph>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>
          {/* ===== OUR STATUS SECTION ===== */}
          <div
            style={{
              backgroundColor: "#EAF4FF",
              padding: "60px 0",
              width: "100%",
              textAlign: "center",
            }}
          >
            <Title level={3}>Our Status</Title>
            <Paragraph>
              Master English with confidence through our specialized courses.
            </Paragraph>

            <Row
              justify="center"
              style={{
                maxWidth: "1000px",
                margin: "30px auto 0",
              }}
            >
              {[
                { number: "850+", text: "Students benefiting globally." },
                { number: "450+", text: "Accredited certificates awarded." },
                { number: "200+", text: "Students’ global exam progress." },
                { number: "10+", text: "Years of expertise." },
              ].map((stat, index) => (
                <Col
                  key={index}
                  xs={12}
                  md={6}
                  style={{ marginBottom: 20, textAlign: "center" }}
                >
                  <Title level={3} style={{ marginBottom: 0 }}>
                    {stat.number}
                  </Title>
                  <Paragraph>{stat.text}</Paragraph>
                </Col>
              ))}
            </Row>
          </div>
        </section>
        {/* ===== ABOUT US SECTION ===== */}
        <section id="about">
          <div style={{ padding: "80px 50px", backgroundColor: "#fff" }}>
            <Row align="middle" gutter={60}>
              <Col xs={24} md={12}>
                <img
                  src={aboutUs}
                  alt="About Us"
                  style={{
                    height:"490px",
                    width: "461px",
                    maxWidth: "500px",
                    borderRadius: 10,
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                  }}
                />
              </Col>
              <Col xs={24} md={12}>
                <Title level={3}>About us</Title>
                <Paragraph strong>
                  Our English courses offer a dynamic approach to language learning.
                </Paragraph>
                <Paragraph>
                  Engage with interactive lessons and improve your skills in a
                  supportive environment.
                </Paragraph>
                <Paragraph>
                  Get comprehensive English training focused on real-world
                  communication. Our courses improve speaking, writing, and
                  comprehension skills.
                </Paragraph>
              </Col>
            </Row>
          </div>

          {/* ===== SIGN UP SECTION ===== */}
          <div
            style={{
              backgroundColor: "#EAF4FF",
              padding: "80px 0",
              textAlign: "center",
            }}
          >
            <Title level={3} style={{fontSize:"40x"}}>Sign up for early access</Title>
            <div style={{ marginTop: 30 }}>
              <Button
                style={{
                  marginRight: 10,
                  borderColor: "#9AB7D0",
                  color: "#9AB7D0",
                }}
                onClick={() => navigate("/login")}
              >
                Login
              </Button>
              <Button
                type="primary"
                style={{
                  backgroundColor: "#9AB7D0",
                }}
                onClick={() => navigate("/signup")}
              >
                Get Started
              </Button>
            </div>
          </div>
        </section>       
      </Content>
      <section id="contact">
        <Footer
      style={{
        backgroundColor: "#F5FAFF",
        padding: "60px 50px",
      }}
    >
      <Row gutter={[40, 40]} justify="space-between">
        {/* Column 1: Brand Info */}
        <Col xs={24} sm={12} md={6}>
          <Title level={5} style={{ color: "black" }}>
            Lang Route
          </Title>
          <div style={{ display: "flex", alignItems: "center", marginBottom: 8 }}>
            <span
              style={{
                fontSize: 16,
                marginRight: 8,
              }}
            >
              📧
            </span>
            <a
              href="mailto:elearnenglish@gmail.com"
              style={{ color: "black", textDecoration: "none" }}
            >
              elearnenglish@gmail.com
            </a>
          </div>
          <div style={{ display: "flex", alignItems: "center" }}>
            <span
              style={{
                fontSize: 16,
                marginRight: 8,
              }}
            >
              📞
            </span>
            <span style={{ color: "black" }}>+1 234 567 8900</span>
          </div>
        </Col>

        {/* Column 2: About Links */}
        <Col xs={12} sm={12} md={4}>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>About Us</li>
            <li>Contact Us</li>
            <li>Courses</li>
            <li>Pricing</li>
          </ul>
        </Col>

        {/* Column 3: Policies */}
        <Col xs={12} sm={12} md={4}>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>Refund Policy</li>
            <li>Privacy Policy</li>
            <li>Blog</li>
          </ul>
        </Col>

        {/* Column 4: Terms & Social */}
        <Col xs={12} sm={12} md={4}>
          <ul style={{ listStyle: "none", padding: 0, lineHeight: "1.8" }}>
            <li>Terms & Conditions</li>
            <li>Join as Instructor</li>
          </ul>
        </Col>

        {/* Column 5: Follow Us */}
        <Col xs={24} sm={12} md={4}>
          <Title level={5} style={{ marginBottom: 16 }}>
            Follow Us
          </Title>
          <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
            <a href="#" style={{ color: "black", fontSize: 18 }}>
              <i className="fa-brands fa-facebook-f"></i>
            </a>
            <a href="#" style={{ color: "black", fontSize: 18 }}>
              <i className="fa-brands fa-linkedin-in"></i>
            </a>
            <a href="#" style={{ color: "black", fontSize: 18 }}>
              <i className="fa-brands fa-behance"></i>
            </a>
            <a href="#" style={{ color: "black", fontSize: 18 }}>
              <i className="fa-brands fa-x-twitter"></i>
            </a>
          </div>
        </Col>
      </Row>

      <div
        style={{
          borderTop: "1px solid #ddd",
          marginTop: 40,
          paddingTop: 20,
          textAlign: "center",
          color: "#666",
        }}
      >
        © 2025 Lang Route | All rights reserved
      </div>
  </Footer>
  </section>

      
    </Layout>
  );
};

export default LandingPage;
