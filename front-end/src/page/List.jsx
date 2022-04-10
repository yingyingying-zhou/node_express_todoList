import React, { useEffect, useState, useRef } from "react";
import moment from "moment";
import { Table, Button, Space, message, Form, Col, Row, Input, DatePicker, Drawer, Select, Popconfirm } from "antd";
import "./list.css";
import request from "../utils/request";
const { Option } = Select;
const List = () => {
  const [data, setData] = useState([]);
  const [total, setTotal] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [page, setPage] = useState(1);
  const [type, setType] = useState("add");
  const [visible, setVisible] = useState(false);
  const [items, setItems] = useState({});
  const [saveStatus, setSaveState] = useState("");
  const formRef = useRef();
  const editHander = (item) => {
    setItems(item);
    setVisible(true);
    setType("edit");
    console.log(formRef, "vformRef");
    setTimeout(() => {
      formRef?.current.setFieldsValue({
        name: item.name,
        content: item.content,
        deadline: moment(item.deadline),
        status: item.status === 2 ? "已完成" : item.status === 1 ? "待完成" : "已删除",
      });
    }, 0);
  };
  const delHandel = (item) => {
    item.status = 3; // 全部改成删除装填
    request.post("/api/update_status", item).then((response) => {
      queryData("-1");
      if (response) message.success("任务删除成功");
    });
  };
  const columns = [
    {
      title: "id",
      dataIndex: "id",
      key: "id",
      width: 100,
      align: "center",
    },
    {
      title: "标题",
      dataIndex: "name",
      key: "name",
      width: 100,
      align: "center",
    },
    {
      title: "内容",
      dataIndex: "content",
      key: "content",
      width: 300,
      align: "center",
    },
    {
      title: "截止日期",
      dataIndex: "deadline",
      key: "deadline",
      width: 150,
      align: "center",
    },
    {
      title: "状态",
      dataIndex: "status",
      key: "status",
      width: 300,
      align: "center",
      render: (text, record) => (record.status === 1 ? "待办" : record.status === 2 ? "完成" : "已删除"),
    },
    {
      title: "Action",
      key: "action",
      render: (text, record) => (
        <Space size="middle">
          <Button onClick={() => editHander(record)}>编辑</Button>
          {record.status !== 3 && record.status !== 2 ? (
            <div>
              <Button type="primary" ghost onClick={() => this.changeStatus(record)}>
                完成
              </Button>
              <Popconfirm title="你确定要删除吗?" onConfirm={() => delHandel(record)} okText="确定" cancelText="取消">
                <Button danger className="delete-line">
                  删除
                </Button>
              </Popconfirm>
            </div>
          ) : null}
        </Space>
      ),
      filters: [
        {
          text: "全部",
          value: -1,
        },
        {
          text: "代办",
          value: 1,
        },
        {
          text: "完成",
          value: 2,
        },
        {
          text: "删除",
          value: 3,
        },
      ],
      filterMultiple: false,
      onFilter: (value, record) => value === record.status,
    },
  ];

  const queryData = (item) => {
    request.get("/api/list/" + item + "/" + page).then((response) => {
      response.data.list.rows.forEach((ele, i) => {
        ele.key = i;
      });
      var items = response.data.list.rows;
      items.forEach((ele) => {
        ele.deadline = ele.deadline?.split("T")[0];
      });
      setData(items);
      setTotal(response.data.list.count);
    });
  };

  const pageChange = (page, pageSize) => {
    setPage(page);
    setPageSize(pageSize);
  };
  // 提交表单
  const onFinish = (itemInfo) => {
    itemInfo.deadline = moment(itemInfo.deadline).format("YYYY-MM-DD");
    // const { type, saveStatus, items } = this.state;
    if (type === "add") {
      // 调用新增接口
      itemInfo.status = 1; // 默认是1
      request.post("/api/create", itemInfo).then((response) => {
        if (response) {
          message.success("任务新增完成");
          queryData("-1");
          setVisible(false);
        }
      });
    } else {
      // 调用修改接口
      itemInfo.status = saveStatus ? saveStatus : items.status;
      itemInfo.id = items.id;
      request.post("/api/update", itemInfo).then((response) => {
        if (response) {
          message.success("任务修改完成");
          queryData("-1");
          setVisible(false);
        }
      });
    }
  };
  const onReset = () => {
    formRef.current?.resetFields();
  };

  const addHandel = () => {
    setVisible(true);
    setType("add");
  };

  useEffect(() => {
    queryData("-1");
  }, []);

  return (
    <>
      <Button type="primary" onClick={addHandel}>
        新增
      </Button>
      <div className="table">
        <Table
          columns={columns}
          dataSource={data}
          pagination={{
            showQuickJumper: false,
            showTotal: () => `共${total}条`,
            pageSize,
            total: total, //数据的总的条数
            onChange: (current, pageCount) => pageChange(current, pageCount), //点击当前页码
          }}
        />
        <Drawer
          title={type === "update" ? "修改" : "新增"}
          width={500}
          placement="right"
          closable={false}
          onClose={() => {
            formRef?.current.resetFields();
            setVisible(false);
          }}
          visible={visible}
        >
          <Form layout="vertical" ref={formRef} onFinish={(event) => onFinish(event)}>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="name"
                  label="任务名称:"
                  rules={[
                    {
                      required: true,
                      message: "请输入任务名称",
                    },
                  ]}
                >
                  <Input placeholder="请输入任务名称" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item
                  name="deadline"
                  label="任务截止日期:"
                  rules={[{ required: true, message: "请选择任务截止日期" }]}
                >
                  <DatePicker className="dateStyle" autoFocus={true} />
                </Form.Item>
              </Col>
            </Row>
            {type === "update" && items.status === 2 && (
              <Row gutter={16}>
                <Col span={24}>
                  <Form.Item name="status" label="修改状态:" rules={[{ required: false }]}>
                    <Select placeholder="请选择状态" onChange={(v) => setSaveState(v)} allowClear>
                      <Option value="1">待办</Option>
                      <Option value="3">删除</Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
            )}
            <Row gutter={16}>
              <Col span={24}>
                <Form.Item name="content" label="任务内容:" rules={[{ required: false }]}>
                  <Input.TextArea placeholder="请填写内容" />
                </Form.Item>
              </Col>
            </Row>
            <Row gutter={16}>
              <Col span={8}></Col>
              <Col span={8}>
                <Button onClick={() => onReset()}>重置</Button>
                <Button type="primary" htmlType="submit" className="submit-btn">
                  提交
                </Button>
              </Col>
              <Col span={8}></Col>
            </Row>
          </Form>
        </Drawer>
      </div>
    </>
  );
};
export default List;
