'use client'
import { React, useState, useEffect } from 'react'
import card from '../../styles/card.module.css'
import '../../styles/hideOverflow.css'
import Link from 'next/link'
import imgArr from './imgArray.js'
import dynamic from 'next/dynamic'

const TinderCard = dynamic(() => import('react-tinder-card'), {
	ssr: false,
})

function swipeNorthApp() {
	const [data, setData] = useState(null)
	const [isLoading, setIsLoading] = useState(false)
	const [error, setError] = useState(null)
	const [number, setNumber] = useState(0)
	const [jobId, setJobId] = useState('')
	const [activeJob, setActiveJob] = useState('activeJob')
	const [key, setKey] = useState(0)
	const [isDataLoaded, setIsDataLoaded] = useState(false)

	// let savedNotInterestedIds = ''
	// const [dataArray, setDataArray] = useState('')
	// const delay = 2000
	// let timerId

	useEffect(() => {
		setIsLoading(true)
		async function fetchData() {
			try {
				const response = await fetch(
					`https://links.api.jobtechdev.se/joblinks?municipality=kicB_LgH_2Dk&limit=100${jobId}`
				)
				const data = await response.json()
				setData(data)
				// setDataArray(data.hits)
				
			} catch (error) {
				setError(error)
			} finally {
				setIsLoading(false)
				// setIsDataLoaded(true)

				// if (isDataLoaded) {
					// console.log(number)
					// setNumber(data.hits.length - 1)
					// console.log(number)
					// next()
					// console.log(number)
			}
		}
		fetchData()
	}, [jobId])

	// useEffect(() => {
	// 	if (isDataLoaded) {
	// 	  console.log(number)
	// 	  setNumber(data.hits.length - 1)
	// 	  console.log(number)
	// 	  next()
	// 	  console.log(number)
	// 	}
	//   }, [isDataLoaded, data])

	if (isLoading) {
		return <h1 className="loading">Vi far norrut ...</h1>
	}

	if (error) {
		return (
			<div className='text-card'>
				<h1>Oj, så pinsamt. Det blev ett fel:</h1>
				<p>{error.message}</p>
				<button className="button">
					<Link href="/">Ladda om</Link>
				</button>
			</div>
		)
	}

	function back() {
		setNumber((prevNumber) =>
			prevNumber != 0 ? prevNumber - 1 : data.hits.length - 1
		)
	}

	function next() {
		console.log('next körs')
		const nextNotInterestedIds =
			JSON.parse(localStorage.getItem('savedNotInterestedIds')) || []

		const NextSavedIds = JSON.parse(localStorage.getItem('savedIds')) || []

		setNumber((prevNumber) =>
			prevNumber < data.hits.length - 1 ? prevNumber + 1 : 0
		)

		if (data) {
			if (
				nextNotInterestedIds.some(
					(obj) => obj.notInterestedId === data.hits[number].id
				) ||
				NextSavedIds.some((obj) => obj.id) === data.hits[number].id
			) {
				setNumber((prevNumber) =>
					prevNumber < data.hits.length - 1 ? prevNumber + 1 : 0
				)
				console.log('+1 extra')
			}
		} else {
			console.log('+0')
		}
	}

	function swipeNorth() {
		{
			// const id = data.hits[number].id
			const id = {
				id: data.hits[number].id,
				headline: data.hits[number].headline,
				employerName: data.hits[number].employer.name,
				link: data.hits[number].source_links[0].url,
			}

			const savedIds = JSON.parse(localStorage.getItem('savedIds')) || []

			if (!savedIds.some((savedId) => savedId.id === id.id)) {
				const newIds = [...savedIds, id]

				data &&
					(setJobId(
						`&occupation-field=${data.hits[number].occupation_field.concept_id}`
					),
					localStorage.setItem('savedIds', JSON.stringify(newIds)),
					console.log(savedIds))
			} else {
				console.log('Dublett!')
			}
		}
	}

	function swipeDown() {
		// setJobId('')

		if (data) {
			const notInterestedId = { notInterestedId: data.hits[number].id }

			const savedNotInterestedIds =
				JSON.parse(localStorage.getItem('savedNotInterestedIds')) || []

			// Check if notInterestedId already exists in savedNotInterestedIds
			if (
				!savedNotInterestedIds.some(
					(id) =>
						id.notInterestedId === notInterestedId.notInterestedId
				)
			) {
				const newNotInterestedIds = [
					...savedNotInterestedIds,
					notInterestedId,
				]
				localStorage.setItem(
					'savedNotInterestedIds',
					JSON.stringify(newNotInterestedIds)
				)
				console.log(savedNotInterestedIds)
			} else {
				console.log(
					`notInterestedId ${notInterestedId.notInterestedId} already exists in savedNotInterestedIds array.`
				)
			}
		}
	}

	const onSwipe = (direction) => {
		// swipeHandler(direction)
		console.log(number)

		if (direction === 'up') {
			swipeNorth()
			reloadTinderSwipe()
			next()
		} else if (direction === 'down') {
			swipeDown()
			reloadTinderSwipe()
			next()
		} else if (direction === 'left') {
			reloadTinderSwipe()
			next()
		} else if (direction === 'right') {
			reloadTinderSwipe()
			back()
		}
		console.log('You swiped: ' + direction)
		console.log(number)
	}

	function reloadTinderSwipe() {
		setKey(key + 1)
		console.log(number)
	}

	// function swipeHandler(direction) {
	// 	setActiveJob('')
	// 	if (direction === 'up') {
	// 		swipeNorth()
	// 		next()
	// 	} else if (direction === 'down') {
	// 		swipeDown()
	// 		next()
	// 	} else if (direction === 'left') {
	// 		next()
	// 	} else if (direction === 'right') {
	// 		back()
	// 	}
	// 	// setActiveJob('activeJob')
	// 	console.log('You swiped: ' + direction)

	// 	if (timerId) {
	// 	clearTimeout(timerId);
	// 	}
	// 	timerId = setTimeout(() => {
	// 		setActiveJob('activeJob')
	// 		//swipeNorth()
	// 	timerId = null
	// 	}, delay)
	// }

	return (
		<div>
			{
				data && (
					// dataArray.map((jobAdvert, index) => (
					<TinderCard onSwipe={onSwipe} key={key}>
						<div
						// className={
						// 	index === number
						// 		? `${card.container} ${card.active}`
						// 		: card.container
						// }
						>
							<div className={`shadow ${card.card} ${activeJob}`}>
								<div className={card.headlineContainer}>
									<h1 className={card.headline}>
										{data.hits[number].headline}
									</h1>
								</div>

								<div className={card.employerContainer}>
									<h2 className={card.employer}>
										{data.hits[number].employer.name}
									</h2>
								</div>

								{imgArr[data.hits[number].id.match(/[0-9]/)]}
								{/* <button className={card.lasMer}>
										Läs mer
									</button> */}

								<div className={card.briefContainer}>
									<div className={card.brief}>
										{data.hits[number].brief}
									</div>
								</div>

								<Link
									href={data.hits[number].source_links[0].url}
								>
									<button className={card.annonsKnapp}>
										ÖPPNA ANNONS
									</button>
								</Link>
							</div>
						</div>
					</TinderCard>
				)
				// ))
			}
		</div>
	)
}

export default swipeNorthApp
