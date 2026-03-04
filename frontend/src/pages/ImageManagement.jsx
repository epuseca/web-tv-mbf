import { useState, useEffect, useCallback } from 'react';
import { Table, Button, Space, Popconfirm, Tag, message, Tooltip } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, ReloadOutlined } from '@ant-design/icons';
import imageApi from '../api/imageApi';
import ImageFormModal from '../components/ImageFormModal';

const ImageManagement = () => {
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(false);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingImage, setEditingImage] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const fetchImages = useCallback(async () => {
        setLoading(true);
        try {
            const res = await imageApi.getAll();
            setImages(res.data.data || []);
        } catch (error) {
            message.error('Không thể tải danh sách hình ảnh!');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchImages();
    }, [fetchImages]);

    const handleAdd = () => {
        setEditingImage(null);
        setModalOpen(true);
    };

    const handleEdit = (record) => {
        setEditingImage(record);
        setModalOpen(true);
    };

    const handleDelete = async (id) => {
        try {
            await imageApi.delete(id);
            message.success('Đã xóa hình ảnh thành công!');
            fetchImages();
        } catch (error) {
            message.error('Xóa hình ảnh thất bại!');
        }
    };

    const handleSubmit = async (data) => {
        setSubmitting(true);
        try {
            if (editingImage) {
                await imageApi.update(editingImage._id, data);
                message.success('Đã cập nhật hình ảnh thành công!');
            } else {
                await imageApi.create(data);
                message.success('Đã thêm hình ảnh thành công!');
            }
            setModalOpen(false);
            setEditingImage(null);
            fetchImages();
        } catch (error) {
            const msg = error.response?.data?.message || 'Thao tác thất bại!';
            message.error(msg);
        } finally {
            setSubmitting(false);
        }
    };

    const columns = [
        {
            title: 'Hình ảnh',
            dataIndex: 'imageBase64',
            key: 'image',
            width: 120,
            render: (base64) => (
                <img src={base64} alt="thumbnail" className="image-thumb" />
            ),
        },
        {
            title: 'Tiêu đề',
            dataIndex: 'title',
            key: 'title',
            ellipsis: true,
            render: (text) => <strong>{text}</strong>,
        },
        {
            title: 'Mô tả',
            dataIndex: 'description',
            key: 'description',
            ellipsis: true,
            responsive: ['lg'],
            render: (text) => text || <span style={{ color: 'var(--text-muted)' }}>—</span>,
        },
        {
            title: 'Ngày tạo',
            dataIndex: 'createdAt',
            key: 'createdAt',
            width: 180,
            responsive: ['md'],
            render: (date) => (
                <Tag color="blue">
                    {new Date(date).toLocaleDateString('vi-VN', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                    })}
                </Tag>
            ),
        },
        {
            title: 'Thao tác',
            key: 'actions',
            width: 140,
            render: (_, record) => (
                <Space>
                    <Tooltip title="Sửa">
                        <Button
                            type="primary"
                            icon={<EditOutlined />}
                            size="small"
                            onClick={() => handleEdit(record)}
                            id={`btn-edit-${record._id}`}
                            style={{ background: '#6366f1', border: 'none' }}
                        />
                    </Tooltip>
                    <Popconfirm
                        title="Xóa hình ảnh?"
                        description="Bạn có chắc chắn muốn xóa hình ảnh này?"
                        onConfirm={() => handleDelete(record._id)}
                        okText="Xóa"
                        cancelText="Hủy"
                        okButtonProps={{ danger: true }}
                    >
                        <Tooltip title="Xóa">
                            <Button
                                danger
                                icon={<DeleteOutlined />}
                                size="small"
                                id={`btn-delete-${record._id}`}
                            />
                        </Tooltip>
                    </Popconfirm>
                </Space>
            ),
        },
    ];

    return (
        <div>
            <div className="page-header">
                <h2>🖼️ Danh sách Hình ảnh ({images.length})</h2>
                <Space>
                    <Button icon={<ReloadOutlined />} onClick={fetchImages} loading={loading} id="btn-refresh">
                        Làm mới
                    </Button>
                    <Button
                        type="primary"
                        icon={<PlusOutlined />}
                        onClick={handleAdd}
                        id="btn-add-image"
                        style={{
                            background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                            border: 'none',
                            fontWeight: 600,
                        }}
                    >
                        Thêm hình ảnh
                    </Button>
                </Space>
            </div>

            <div className="image-table-card">
                <Table
                    columns={columns}
                    dataSource={images}
                    rowKey="_id"
                    loading={loading}
                    pagination={{
                        pageSize: 10,
                        showSizeChanger: true,
                        showTotal: (total) => `Tổng: ${total} hình ảnh`,
                    }}
                    locale={{
                        emptyText: 'Chưa có hình ảnh nào. Nhấn "Thêm hình ảnh" để bắt đầu.',
                    }}
                />
            </div>

            <ImageFormModal
                open={modalOpen}
                onCancel={() => {
                    setModalOpen(false);
                    setEditingImage(null);
                }}
                onSubmit={handleSubmit}
                initialValues={editingImage}
                loading={submitting}
            />
        </div>
    );
};

export default ImageManagement;
