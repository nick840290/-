import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { Modal, Button, Table, Form } from 'react-bootstrap';
import { useEffect } from 'react';
import axios from 'axios';
import { API_URL } from '../../utils/config';
import { useLogin } from '../../context/LoginStatus';

const OrderList = () => {
  //取得已登入會員的ID
  const { user } = useLogin();
  const [data, setData] = useState([]);
  const [sortDate, setSortDate] = useState(false);
  const [sortTotal, setSortTotal] = useState(false);
  const [sort, setSort] = useState('default');
  const [orderdata, setOrderData] = useState([
    { recipient: '', image: '3.webp' },
  ]);
  const [show, setShow] = useState({
    in: false,
    out: false,
  });
  const isOrderList = data.length === 0;
  const handleIn = show.in
    ? 'animation animation__modal animation__modal--in'
    : '';
  const handleOut = show.out
    ? 'animation animation__modal animation__modal--out'
    : '';

  //取得使用者的訂單
  useEffect(() => {
    let getOrder = async () => {
      let response = await axios.post(`${API_URL}/order`, user, {
        withCredentials: true,
      });
      setData(response.data);
    };

    getOrder();
  }, []);

  //訂單排列順序
  const sortObject = (sortType) => {
    if (sortType === 'create_at') {
      if (sortDate === true) {
        return data.sort((a, b) => a.id - b.id);
      } else {
        return data.sort((a, b) => a.id - b.id).reverse();
      }
    } else {
      if (sortTotal === true) {
        return data.sort((a, b) => a.total - b.total);
      } else {
        return data.sort((a, b) => a.total - b.total).reverse();
      }
    }
  };

  //訂單排列順序
  const changeSort = (sortType) => {
    if (sortType === 'create_at') {
      return data.sort((a, b) => {
        var dateA = new Date(a.create_at);
        var dateB = new Date(b.create_at);
        return dateA - dateB;
      });
    } else {
      return data.sort((a, b) => a.total - b.total);
    }
  };

  //訂單詳細頁面
  const handleShow = (order) => {
    setShow({ ...setShow, in: true });

    let getOrderdetail = async () => {
      let response = await axios.post(`${API_URL}/order/orderdetail`, order, {
        withCredentials: true,
      });
      setOrderData([...response.data]);
    };

    getOrderdetail();
  };

  //詳細頁面關閉

  const handleClose = () => {
    setShow({ ...show, out: true });
    setTimeout(() => {
      setShow({ ...show, in: false, out: false });
    }, 500);
    // setOrderData([]);
  };

  return (
    <>
      {!isOrderList ? (
        <div className="d-none d-lg-block u-height u-height--page">
          <div className="d-flex d-none d-lg-block">
            <table className="table table-borderless orderlist_table">
              <thead>
                <tr>
                  <th scope="col">訂單編號</th>
                  <th
                    scope="col"
                    onClick={() => {
                      sortObject('create_at');
                      setSortDate(!sortDate);
                    }}
                  >
                    訂單日期 {''}
                    <i
                      className="fa fa-sort"
                      aria-hidden="true"
                      style={{ color: '#f8bc5d' }}
                    ></i>
                  </th>
                  <th scope="col">付款狀態</th>
                  <th scope="col">訂單狀態</th>
                  <th scope="col" className="d-flex align-items-center">
                    總計
                    <button
                      type="button"
                      className="e-btn e-btn--icon e-btn--none"
                      onClick={() => {
                        sortObject('total');
                        setSortTotal(!sortTotal);
                      }}
                    >
                      <i
                        className="fa fa-sort"
                        aria-hidden="true"
                        style={{ color: '#f8bc5d' }}
                      />
                    </button>
                  </th>
                  <th scope="col">查看</th>
                </tr>
              </thead>

              {data.map((order) => {
                return (
                  <tbody key={order.id}>
                    <tr>
                      <th scope="row" className="order_td__order_id">
                        {order.id}
                      </th>
                      <td className="order_td__create_at">{order.create_at}</td>
                      <td className="order_td__payment_status">
                        {order.payment_status}
                      </td>
                      <td className="order_td__order_status">
                        {order.order_status}
                      </td>
                      <td className="order_td__total">{order.total}</td>
                      <td className="p-0">
                        <button
                          onClick={() => {
                            handleShow(order);
                          }}
                          className="e-btn e-btn--icon e-btn--outline"
                        >
                          <i className="fas fa-eye icon_grn e-icon"></i>
                        </button>
                      </td>
                    </tr>
                  </tbody>
                );
              })}
            </table>
          </div>
        </div>
      ) : (
        <></>
      )}
      {/* RWD */}

      <div className="d-flex d-lg-none justify-content-center mb-2 pb-3">
        <Form.Select
          className="form-select c-form__select"
          value={sort}
          onChange={(e) => {
            setSort(e.target.value);
            changeSort(e.target.value);
          }}
        >
          <option value="default" disabled>
            訂單排序依...
          </option>
          <option value="create_at">訂單日期</option>
          <option value="total">總計價格</option>
        </Form.Select>
      </div>
      {!isOrderList ? (
        data.map((order) => {
          return (
            <div
              className="d-flex d-lg-none justify-content-center mb-3 "
              key={order.id}
            >
              <div className="container">
                <div className="card cardorder">
                  <div
                    onClick={() => {
                      handleShow(order);
                    }}
                    className="card-body "
                  >
                    <h5 className="card-title order_td__order_id">
                      訂單編號:{order.id}
                    </h5>
                    <div className="card-text">
                      <div className="my-3 d-flex justify-content-between">
                        <div>訂單日期</div>
                        <div className="order_td__create_at">
                          {order.create_at}
                        </div>
                      </div>
                      <div className="orderline">
                        <div className="my-3 d-flex justify-content-between">
                          <div>付款狀態</div>
                          <div className="order_td__payment_status">
                            {order.payment_status}
                          </div>
                        </div>
                        <div className="my-3 d-flex justify-content-between">
                          <div>訂單狀態</div>
                          <div className="order_td__order_status">
                            {order.order_status}
                          </div>
                        </div>
                        <div className="my-3 d-flex justify-content-between">
                          <div>總計</div>
                          <div className="order_td__total">{order.total}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          );
        })
      ) : (
        <div className="u-height u-height--empty-page">
          <div className="empty_img">
            <img
              className="img-responsive"
              src={
                require('../../img/common/illustration/order-empty.svg').default
              }
              alt=""
            />
            <h5>沒有歷史訂單喔！趕快去下單吧！</h5>
          </div>
        </div>
      )}
      <Modal
        centered
        show={show.in}
        onHide={handleClose}
        animation={false}
        dialogClassName={`c-modal c-modal__modal ${handleIn} ${handleOut}`}
        backdropClassName={`c-modal__backdrop ${handleIn} ${handleOut}`}
        contentClassName="c-modal__wrapper c-modal__wrapper--full-page"
        fullscreen="md-down"
      >
        <div className="c-order-detail">
          <div className="l-header__title mb-4">
            <div className="d-flex align-items-center">
              {/* <img src={} alt="food" /> */}
              <h3 className="l-header__text ms-0">訂單詳情</h3>
            </div>
          </div>
          <button
            onClick={handleClose}
            className="c-modal__close e-btn e-btn--icon"
          >
            <i className="fas fa-times e-icon e-icon--btn e-icon--primary"></i>
          </button>
          <div className="c-order-detail__content">
            <h6 className="c-order-detail__heading">
              訂購人:
              <span className="c-order-detail__text">
                {orderdata[0].purchaser}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              收件人:
              <span className="c-order-detail__text">
                {orderdata[0].recipient}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              聯絡電話:
              <span className="c-order-detail__text">{orderdata[0].tel}</span>
            </h6>
            <h6 className="c-order-detail__heading">
              付款方式:
              <span className="c-order-detail__text">
                {orderdata[0].provider}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              取貨方式:
              <span className="c-order-detail__text">
                {orderdata[0].method}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              配送地址:
              <span className="c-order-detail__text">
                {orderdata[0].county}
                {orderdata[0].district}
                {orderdata[0].address}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              折扣後金額:
              <span className="c-order-detail__text">{orderdata[0].total}</span>
            </h6>
            <h6 className="c-order-detail__heading">
              成立時間:
              <span className="c-order-detail__text">
                {orderdata[0].create_at}
              </span>
            </h6>
            <h6 className="c-order-detail__heading">
              品項數量:
              <span className="c-order-detail__text">{orderdata.length}</span>
            </h6>
          </div>
          <table className="table table-borderless orderlist_table">
            <thead>
              <tr>
                <th className="detailContent detailContent--name">品名</th>
                <th className="detailContent">份數</th>
                <th className="detailContent">小計</th>
              </tr>
            </thead>
            {orderdata.map((orderdata) => {
              return (
                <tbody key={orderdata.image}>
                  <tr>
                    <td className="detailContent detailContent--name">
                      {orderdata.name}
                    </td>
                    <td className="detailContent">{orderdata.amount}</td>
                    <th className="detailContent">
                      {(orderdata.price * orderdata.amount).toString()}
                    </th>
                  </tr>
                </tbody>
              );
            })}
          </table>
        </div>
      </Modal>
    </>
  );
};

export default OrderList;
