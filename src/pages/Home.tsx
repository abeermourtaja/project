import {  Badge, Card, Col, Input, Layout, Row, Space, Typography } from "antd";

import {FileTextOutlined,SearchOutlined,BellFilled,VideoCameraOutlined,CalendarOutlined} from "@ant-design/icons";
import lecture from "../assets/lecture.png";
import { Content } from "antd/es/layout/layout";
import { COLORS } from "../constants/colors";
import { useNavigate } from "react-router-dom";
function Home(){
      const { Title, Text } = Typography;
      const navigate = useNavigate();
    return(
        <Layout style={{ backgroundColor:COLORS.background,marginLeft: 220, padding: "30px" , width: "100%"}}>
            <Content style={{ width: "100%" }}>
                <Title
                    level={3}
                    style={{
                    fontSize:"27",
                    fontFamily: "Segoe UI, sans-serif",
                    fontWeight: 700,
                    color:" #21629B",
                    margin: 0,
                    }}
                >
                    Home
                </Title>
                {/* Search + Notification */}
                <Row align="middle">
                    <Input
                        placeholder="Search"
                        prefix={<SearchOutlined />}
                        allowClear
                        style={{
                        width: '100%',
                        maxWidth: 650,
                        backgroundColor: "#EDEDED",
                        height: "40px",
                        borderRadius: "12px"
                        }}
                    />
                    <div style={{
                        width: 56,
                        height: 56,
                        backgroundColor: '#fff',
                        borderRadius: 4,
                        marginLeft: 16,
                        position: 'relative', // 👈 enables absolute positioning inside
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}>
                        <Badge
                            count={1}
                            size="small"
                            style={{ backgroundColor: "#9AB7D0" }}
                        >
                        <BellFilled
                                style={{
                                    fontSize: 22,
                                    color: "#000",
                                    cursor: "pointer",
                                }}
                                onClick={
                                    ()=>{
                                        navigate("n");
                                    }
                                }
                        />
                        </Badge>
                    </div>
                </Row>
                {/* Welcome Card */}
                <Card
                    style={{
                        borderRadius: 12,
                        backgroundColor: "#9AB7D0",
                        padding: 20,
                        marginBottom: 30,
                        marginTop: 17,
                        height:"181px",
                        display:"flex",
                        justifyContent:"center",
                        alignItems:"center"
                    }}
                >
                    <Row align="middle" justify="space-between">
                        <Col span={16}>
                            <Title level={3} style={{ margin: 0 }}>
                            Hi, Sara
                            </Title>
                            <Text style={{ fontSize: 16 }}>
                            Welcome to your course! Stay focused and keep going until the
                            end.
                            </Text>
                        </Col>
                        <Col span={8}>
                            <img
                            src={lecture}
                            alt="student illustration"
                            style={{ width: "100%", maxWidth: 200 }}
                            />
                        </Col>
                    </Row>
                </Card>
                {/* Announcements */}
                <div style={{ marginBottom: 20 }}>
                    <Title style={{fontWeight:"bold"}} level={4}>Announcements:</Title>
                    <Space direction="vertical" size="middle">
                    <Text>
                        <FileTextOutlined style={{ marginRight: 8, color: "#000" }} />
                        <b>New Assignment:</b> Assignment Lab 1 has been uploaded.
                    </Text>
                    <Text>
                        <CalendarOutlined style={{ marginRight: 8, color: "#e74c3c" }} />
                        <b>Upcoming Exam:</b> Exam lab 1 is scheduled for Monday.
                    </Text>
                    <Text>
                        <VideoCameraOutlined style={{ marginRight: 8, color: "#000" }} />
                        <b>New Lecture:</b> Lecturer lab 2 has been uploaded.
                    </Text>
                    </Space>
                </div>
            </Content>
         </Layout>
    );
}
export default Home;