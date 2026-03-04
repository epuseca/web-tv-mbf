import { useState, useEffect } from 'react';
import { Modal, Form, Input, Upload, Button, message as antMessage } from 'antd';
import { UploadOutlined } from '@ant-design/icons';

const { TextArea } = Input;

const ImageFormModal = ({ open, onCancel, onSubmit, initialValues, loading }) => {
    const [form] = Form.useForm();
    const [preview, setPreview] = useState('');

    const isEdit = !!initialValues;

    useEffect(() => {
        if (open) {
            if (initialValues) {
                form.setFieldsValue({
                    title: initialValues.title,
                    description: initialValues.description,
                });
                setPreview(initialValues.imageBase64 || '');
            } else {
                form.resetFields();
                setPreview('');
            }
        }
    }, [open, initialValues, form]);

    const handleFileChange = (info) => {
        const file = info.file?.originFileObj || info.file;
        if (!file) return;

        // Validate file type
        const isImage = file.type?.startsWith('image/');
        if (!isImage) {
            antMessage.error('Chỉ được upload file hình ảnh!');
            return;
        }

        // Validate file size (max 10MB)
        const isLt10M = file.size / 1024 / 1024 < 10;
        if (!isLt10M) {
            antMessage.error('Hình ảnh phải nhỏ hơn 10MB!');
            return;
        }

        // Convert to base64
        const reader = new FileReader();
        reader.onload = () => {
            setPreview(reader.result);
        };
        reader.readAsDataURL(file);
    };

    const handleSubmit = async () => {
        try {
            const values = await form.validateFields();
            if (!preview && !isEdit) {
                antMessage.error('Vui lòng upload hình ảnh!');
                return;
            }

            const data = {
                title: values.title,
                description: values.description || '',
            };

            // Only include image if new one uploaded or creating new
            if (preview && preview !== initialValues?.imageBase64) {
                data.imageBase64 = preview;
            }

            await onSubmit(data);
            form.resetFields();
            setPreview('');
        } catch (err) {
            // Form validation error — silently handled by Ant Design
        }
    };

    return (
        <Modal
            title={isEdit ? '✏️ Sửa Hình ảnh' : '➕ Thêm Hình ảnh mới'}
            open={open}
            onCancel={() => {
                form.resetFields();
                setPreview('');
                onCancel();
            }}
            footer={[
                <Button key="cancel" onClick={onCancel} id="modal-cancel">
                    Hủy
                </Button>,
                <Button
                    key="submit"
                    type="primary"
                    loading={loading}
                    onClick={handleSubmit}
                    id="modal-submit"
                    style={{
                        background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                        border: 'none',
                    }}
                >
                    {isEdit ? 'Cập nhật' : 'Thêm mới'}
                </Button>,
            ]}
            width={600}
            destroyOnClose
        >
            <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
                <Form.Item
                    label="Tiêu đề"
                    name="title"
                    rules={[
                        { required: true, message: 'Vui lòng nhập tiêu đề!' },
                        { max: 200, message: 'Tiêu đề tối đa 200 ký tự!' },
                    ]}
                >
                    <Input placeholder="Nhập tiêu đề slide" id="form-title" />
                </Form.Item>

                <Form.Item
                    label="Mô tả"
                    name="description"
                    rules={[
                        { max: 1000, message: 'Mô tả tối đa 1000 ký tự!' },
                    ]}
                >
                    <TextArea
                        rows={3}
                        placeholder="Nhập mô tả (tuỳ chọn)"
                        id="form-description"
                    />
                </Form.Item>

                <Form.Item label="Hình ảnh" required={!isEdit}>
                    <Upload
                        beforeUpload={() => false}
                        onChange={handleFileChange}
                        maxCount={1}
                        accept="image/*"
                        showUploadList={false}
                    >
                        <Button icon={<UploadOutlined />} id="form-upload">
                            Chọn hình ảnh
                        </Button>
                    </Upload>
                    {preview && (
                        <div style={{ marginTop: 12 }}>
                            <img
                                src={preview}
                                alt="Preview"
                                style={{
                                    maxWidth: '100%',
                                    maxHeight: 200,
                                    borderRadius: 8,
                                    border: '1px solid var(--border-color)',
                                }}
                            />
                        </div>
                    )}
                </Form.Item>
            </Form>
        </Modal>
    );
};

export default ImageFormModal;
