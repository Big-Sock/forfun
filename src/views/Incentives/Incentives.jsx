import React, { useState, useEffect } from "react";
import { BaseView } from "../BaseView";
import { useWallet } from "use-wallet";
import Axios from 'axios'

import { getRedeemed, redeemIncentives } from '../../web3/utils.js'

const Incentives = () => {
	const { account, connect } = useWallet()
	const [tableData, setTableData] = useState(null)
	const [redeemed, setRedeemed] = useState(null)
	const [totalRedeemable, setTotalRedeemable] = useState(null)

	const completeIncentive = async () => {
		await Axios.post('/api/incentives/complete', {
			user: account
		})
		updateTable()
	}

	const updateTable = async () => {
		const res = await Axios.get('/api/incentives/all/' + account)
		let tData = []
		let total = 0
		for (const data of res.data) {
			tData.push({
				key: Math.random(),
				incentiveType: data.incentiveType,
				amount: data.amount
			})
			total += data.amount
		}
		setTableData(tData)
		setTotalRedeemable(total)
	}

	const updateRedeemed = async () => {
		getRedeemed(setRedeemed)
	}

	const redeem = async () => {
		const totalAmount = totalRedeemable
		const res = await Axios.post('/api/incentives/redeem', {
			address: account,
			totalAmount
		})
		if (res.data.error) {
			alert('error')
			return
		}
		const weiTotal = res.data.weiTotal
		const timestamp = res.data.timestamp
		const signature = res.data.signature
		await redeemIncentives(weiTotal, timestamp, signature)
			.catch(e => {
				alert(e.error ? e.error.message : e.message)
			})
		updateRedeemed()
	}

	useEffect(() => {
		if (account) {
			updateTable()
			updateRedeemed()
		}
	}, [account])

	let tableRows = []
	if (tableData) {
		tableRows = tableData.map(data =>
			<div key={data.key}>{data.incentiveType}: {data.amount}</div>
		)
	}

	if (tableData === null || redeemed === null || totalRedeemable === null)
		return <BaseView>Unlock wallet pls</BaseView>
	return (
		<BaseView>
			<button onClick={completeIncentive}>Complete incentive</button>
			<div style={{border: '2px solid black'}}>
				{tableRows}
			</div>
			<p>You have {totalRedeemable - redeemed} unredeemed!</p>
			<button onClick={redeem}>Redeem</button>
		</BaseView>
	)
};

export default Incentives