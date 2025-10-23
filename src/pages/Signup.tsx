import { Button, Col, Form, Input, Row } from "antd";
import SignupImage from '../assets/signup.png';
import { COLORS } from "../constants/colors";
import { useNavigate } from "react-router-dom";

function Signup(){
    const navigate = useNavigate();
    return (
        <div
            style={{
                height: '100vh', // Ensures the parent container takes the full height of the viewport
                width: '100vw', // Ensures the parent container takes the full width of the viewport
                margin: 0,
                padding: 0,
                display: 'flex',
                flexDirection: 'column',
            }}
            >
            <Row 
                gutter={0} // Removes spacing between columns
                style={{
                    flex: 1, // Ensures the Row stretches to fill the parent container
                    width: '100%', // Ensures the Row takes the full width of the viewport
                    margin: 0,
                }}>
                <Col
                    xs={0}
                    sm={0}
                    md={12}
                    style={{
                        height: '100%', // Ensures the Col takes the full height of the Row
                        width: '100%', // Ensures the Col takes the full width of its parent
                        backgroundColor: COLORS.primary,
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <img
                        src={SignupImage}
                        alt="Login Illustration"
                        style={{ maxWidth: '80%', height: '100%', objectFit: 'contain' }}
                    />
                </Col>
                <Col
                    xs={24}
                    sm={24}
                    md={12}
                    style={{
                        height: '100%', // Ensures the Col takes the full height of the Row
                        width: '100%', // Ensures the Col takes the full width of its parent
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        backgroundColor: COLORS.background,
                        padding: '2rem',
                    }}>
                    <div  style={{
                        width: '100%',
                        maxWidth: 400,
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        }}>
                        <h2 style={{color:'black',textAlign: 'start', marginBottom: '2rem', fontWeight: 700 ,fontFamily:'Poppins' ,fontSize:'32'}}>signup</h2>
                        
                        <Form layout='vertical'>
                            <Form.Item label='Name'name='Name'rules={[{ required: true, message: 'Please enter your Name!'  }]}>
                                <Input placeholder="Enter your Name"/>
                            </Form.Item>
                            <Form.Item  label='Email'name='email'rules={[{ required: true, message: 'Please enter your email!'  }]}>
                                 <Input placeholder="Enter your Email"/>
                            </Form.Item>
                            <Form.Item label='Password' name='password' rules={[{required:true ,message:'Please enter your password'}]}>
                                <Input.Password placeholder="Enter your Password"/>
                            </Form.Item>
                            <Form.Item label='Confirm password' name='Confirm password' rules={[{required:true ,message:'Please enter your password'}]}>
                                <Input.Password placeholder="Confirm your Password"/>
                            </Form.Item>
                            <Form.Item>
                                <Button type='primary' htmlType="submit" block onClick={ () => navigate("/home")} style={{fontWeight: 700 ,fontFamily:'Roboto' ,fontSize:'16', backgroundColor:COLORS.primary }}>Sign up</Button>
                            </Form.Item>
                        </Form>
                    </div>
                </Col>
            </Row>
        </div>
    );
}
export default Signup;