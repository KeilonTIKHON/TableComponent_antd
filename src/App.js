import React, { useState } from 'react';
import { Table, Button, Modal, Form, Input, DatePicker, InputNumber, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined } from '@ant-design/icons';
import moment from 'moment';


const DataTable = () => {
  const [data, setData] = useState([]);
  const [editingRecord, setEditingRecord] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [searchText, setSearchText] = useState('');

  const showModal = (record = null) => {
    setEditingRecord(record);
    setIsModalVisible(true);
    if (record) {
      form.setFieldsValue({
        name: record.name,
        date: moment(record.date),
        value: record.value,
      });
    } else {
      form.resetFields();
    }
  };

  const handleOk = () => {
    form.validateFields().then((values) => {
      const newData = [...data];
      if (editingRecord) {
        const index = newData.findIndex((item) => item.key === editingRecord.key);
        newData[index] = {
          key: editingRecord.key,
          name: values.name,
          date: values.date.format('YYYY-MM-DD'),
          value: values.value,
        };
      } else {
        newData.push({
          key: Date.now().toString(),
          name: values.name,
          date: values.date.format('YYYY-MM-DD'),
          value: values.value,
        });
      }
      setData(newData);
      setIsModalVisible(false);
    });
  };

  const handleDelete = (key) => {
    setData(data.filter((item) => item.key !== key));
  };

  const columns = [
    {
      title: 'Имя',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
    },
    {
      title: 'Дата',
      dataIndex: 'date',
      key: 'date',
      sorter: (a, b) => new Date(a.date) - new Date(b.date),
    },
    {
      title: 'Значение',
      dataIndex: 'value',
      key: 'value',
      sorter: (a, b) => a.value - b.value,
    },
    {
      title: 'Действия',
      key: 'actions',
      render: (_, record) => (
        <Space>
          <Button icon={<EditOutlined />} onClick={() => showModal(record)} />
          <Popconfirm title="Уверены, что хотите удалить?" onConfirm={() => handleDelete(record.key)}>
            <Button icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  const filteredData = data.filter((item) =>
    Object.values(item).some((val) => val.toString().toLowerCase().includes(searchText.toLowerCase()))
  );

  return (
    <>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" icon={<PlusOutlined />} onClick={() => showModal()}>
          Добавить
        </Button>
        <Input.Search
          placeholder="Поиск..."
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
      </Space>
      <Table columns={columns} dataSource={filteredData} />
      <Modal
        title={editingRecord ? 'Редактировать запись' : 'Добавить запись'}
        visible={isModalVisible}
        onOk={handleOk}
        onCancel={() => setIsModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Имя"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="date"
            label="Дата"
            rules={[{ required: true, message: 'Пожалуйста, выберите дату' }]}
          >
            <DatePicker style={{ width: '100%' }} />
          </Form.Item>
          <Form.Item
            name="value"
            label="Значение"
            rules={[{ required: true, message: 'Пожалуйста, введите значение' }]}
          >
            <InputNumber style={{ width: '100%' }} />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default DataTable;