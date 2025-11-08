import React, { useState, useEffect, useCallback } from 'react';
import { Card, Form, Input, Button, Space, Typography, Table, message } from 'antd';
import { ethers } from 'ethers';
import { getContract } from '../../service/nft-service';
import { trying } from '../../service/connection-service';
import { rpcUrl } from '../../config';
import {
  getRoyaltyFraction,
  getFeeRate,
  getFeeCollector,
  setRoyaltyFraction,
  setFeeRate,
  setFeeCollector,
  withdrawFees,
  getContractBalance,
} from '../../service/nft-service';

const { Title, Text } = Typography;

const RoyaltySettings: React.FC = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(true);
  const [isOwner, setIsOwner] = useState(false);
  const [contractInfo, setContractInfo] = useState({
    royaltyFraction: 0,
    feeRate: '0',
    feeCollector: '',
    contractBalance: '0',
  });

  // 检查当前用户是否为合约所有者
  const checkIsOwner = useCallback(async () => {
    try {
      const { success, signer } = await trying(false);
      if (!success || !signer) {
        return false;
      }

      const provider = new ethers.JsonRpcProvider(rpcUrl());
      const contract = getContract(provider);
      const owner = await contract.owner();
      const userAddress = await signer.getAddress();

      return owner.toLowerCase() === userAddress.toLowerCase();
    } catch (error) {
      console.error('检查所有者身份失败:', error);
      return false;
    }
  }, []);

  // 加载合约信息
  const loadContractInfo = useCallback(async () => {
    setLoading(true);
    try {
      const [royaltyResult, feeRateResult, feeCollectorResult, isOwnerResult, balanceResult] = await Promise.all([
        getRoyaltyFraction(),
        getFeeRate(),
        getFeeCollector(),
        checkIsOwner(),
        getContractBalance(),
      ]);

      setContractInfo({
        royaltyFraction: royaltyResult.success ? royaltyResult.fraction : 0,
        feeRate: feeRateResult.success ? feeRateResult.feeRate : '0',
        feeCollector: feeCollectorResult.success ? feeCollectorResult.collector : '',
        contractBalance: balanceResult.success ? balanceResult.balance : '0',
      });

      setIsOwner(isOwnerResult);
    } catch (error) {
      console.error('加载合约信息失败:', error);
      message.error('加载合约信息失败');
    } finally {
      setLoading(false);
    }
  }, [checkIsOwner]);

  useEffect(() => {
    void loadContractInfo();
  }, [loadContractInfo]);

  // 设置版税比例
  const handleSetRoyaltyFraction = async (values: { royaltyFraction: number }) => {
    const result = await setRoyaltyFraction(values.royaltyFraction);
    if (result.success) {
      await loadContractInfo();
    }
  };

  // 设置费用率
  const handleSetFeeRate = async (values: { feeRate: string }) => {
    const result = await setFeeRate(values.feeRate);
    if (result.success) {
      await loadContractInfo();
    }
  };

  // 设置费用收集者
  const handleSetFeeCollector = async (values: { feeCollector: string }) => {
    const result = await setFeeCollector(values.feeCollector);
    if (result.success) {
      await loadContractInfo();
    }
  };

  // 提取费用
  const handleWithdrawFees = async () => {
    const result = await withdrawFees();
    if (result.success) {
      await loadContractInfo();
    }
  };

  // 版税信息表格
  const contractInfoColumns = [
    {
      title: '参数',
      dataIndex: 'parameter',
      key: 'parameter',
    },
    {
      title: '值',
      dataIndex: 'value',
      key: 'value',
    },
  ];

  const contractInfoData = [
    {
      key: '1',
      parameter: '版税比例',
      value: contractInfo.royaltyFraction,
    },
    {
      key: '2',
      parameter: '铸造费用',
      value: contractInfo.feeRate,
    },
    {
      key: '3',
      parameter: '费用收集者地址',
      value: contractInfo.feeCollector,
    },
    {
      key: '4',
      parameter: '合约余额',
      value: `${ethers.formatEther(contractInfo.contractBalance)} ETH`,
    },
  ];

  return (
    <div>
      <Title level={3}>版税管理</Title>

      <Card title='合约信息' loading={loading} style={{ marginBottom: 20 }}>
        <Table columns={contractInfoColumns} dataSource={contractInfoData} pagination={false} size='small' />
      </Card>

      {isOwner && (
        <Card title='版税设置' style={{ marginBottom: 20 }}>
          <Form
            form={form}
            layout='vertical'
            onFinish={handleSetRoyaltyFraction}
            initialValues={{ royaltyFraction: contractInfo.royaltyFraction }}
          >
            <Form.Item
              label='版税比例 (数值，如200表示2%)'
              name='royaltyFraction'
              rules={[{ required: true, message: '请输入版税比例' }]}
            >
              <Input placeholder='输入版税比例值' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                设置版税比例
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {isOwner && (
        <Card title='费用设置' style={{ marginBottom: 20 }}>
          <Form layout='vertical' onFinish={handleSetFeeRate} initialValues={{ feeRate: contractInfo.feeRate }}>
            <Form.Item label='铸造费用 (wei)' name='feeRate' rules={[{ required: true, message: '请输入铸造费用' }]}>
              <Input placeholder='输入铸造费用 (wei)' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                设置铸造费用
              </Button>
            </Form.Item>
          </Form>

          <Form
            layout='vertical'
            onFinish={handleSetFeeCollector}
            initialValues={{ feeCollector: contractInfo.feeCollector }}
            style={{ marginTop: 20 }}
          >
            <Form.Item
              label='费用收集者地址'
              name='feeCollector'
              rules={[{ required: true, message: '请输入费用收集者地址' }]}
            >
              <Input placeholder='输入费用收集者钱包地址' />
            </Form.Item>
            <Form.Item>
              <Button type='primary' htmlType='submit'>
                设置费用收集者
              </Button>
            </Form.Item>
          </Form>
        </Card>
      )}

      {isOwner && (
        <Card title='费用管理'>
          <div style={{ marginBottom: '16px' }}>
            <Text strong>可提取金额: </Text>
            <Text type="success">{ethers.formatEther(contractInfo.contractBalance)} ETH</Text>
          </div>
          <Space>
            <Button
              type='primary'
              onClick={handleWithdrawFees}
              disabled={contractInfo.contractBalance === '0'}
            >
              提取合约资金
            </Button>
            <Button onClick={loadContractInfo}>刷新信息</Button>
          </Space>
        </Card>
      )}

      {!isOwner && (
        <Card title='提示'>
          <Text type='secondary'>您不是合约所有者，只能查看版税信息，无法修改设置。</Text>
        </Card>
      )}
    </div>
  );
};

export default RoyaltySettings;
