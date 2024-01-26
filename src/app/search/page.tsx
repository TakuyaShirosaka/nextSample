'use client';

import React, {useEffect, useState} from 'react';
import {SearchableStore, SearchableStoreData, SearchCriteria, Store, testData} from "@/app/search/testData";

// 検索画面コンポーネント
export default function Page() {

    const [userLocation, setUserLocation] = useState({
        lat: 0,
        lng: 0,
    });

    // マスタデータを検索用に加工
    const [searchableStoreData, setSearchableStore] = useState<SearchableStoreData>({
        stores: []
    });

    // 検索条件のステート
    const [searchCriteria, setSearchCriteria] = useState<SearchCriteria>({
        userLatitude: 0, // User緯度
        userLongitude: 0, // User経度
        area: 0,
        keyword: '',
        parking: false,
        barrierFree: false,
        cashless: false,
        foodProvider: false,
        freeWifi: false,
        demaeCan: false,
        uber: false,
        walt: false,
    });

    // 検索結果のステート
    const [searchResultsData, setSearchResultsData] = useState<SearchableStore[]>([]);

    const searchStores = (searchableStore: SearchableStoreData, searchCriteria: SearchCriteria) => {
        return searchableStore.stores.filter(store => {

                let matchesCriteria = true; // 条件を満たすかどうかのフラグ

                // 地域コードのチェック
                if (searchCriteria.area !== 0 && store.category.area !== searchCriteria.area) {
                    matchesCriteria = false;
                }

                // キーワードのチェック
                const trimmedKeyword = searchCriteria.keyword.trim();
                if (trimmedKeyword) {
                    const keywords: string[] = trimmedKeyword.split(' ');
                    const matchKeyword = keywords.every(keyword =>
                        store.store_name.includes(keyword) ||
                        store.address.includes(keyword) ||
                        store.phone_number.includes(keyword)
                    );
                    if (!matchKeyword) matchesCriteria = false;
                }

                // 駐車場のチェック
                if (searchCriteria.parking && !store.category.parking) matchesCriteria = false;

                // バリアフリーのチェック
                if (searchCriteria.barrierFree && !store.category.barrierFree) matchesCriteria = false;

                // キャッシュレスのチェック
                if (searchCriteria.cashless && !store.category.cashless) matchesCriteria = false;

                // フードプロバイダーのチェック
                if (searchCriteria.foodProvider && !store.category.foodProvider) matchesCriteria = false;

                // Free Wi-Fiのチェック
                if (searchCriteria.freeWifi && !store.category.freeWifi) matchesCriteria = false;

                // 出前館のチェック
                if (searchCriteria.demaeCan && !store.category.demaeCan) matchesCriteria = false;

                // Uberのチェック
                if (searchCriteria.uber && !store.category.uber) matchesCriteria = false;

                // Waltのチェック
                if (searchCriteria.walt && !store.category.walt) matchesCriteria = false;

                return matchesCriteria;
            }
        );
    };


    // データの読み込み
    useEffect(() => {
        // 検索条件に基づいたストアデータの例
        const stores = testData.stores.map(store => ({
            ...store,
            search_keyword: `${store.store_name} ${store.address} ${store.phone_number}`,
            distance_from_user: 0  // 経度・緯度の取得はユーザーの任意アクションが必要なため0で初期化
        }));

        const initializeSearchableStoreData: SearchableStoreData = {
            stores: stores
        };

        setSearchableStore(initializeSearchableStoreData);
    }, []);

    useEffect(() => {
        console.dir(searchResultsData);
    }, [searchResultsData]);

    // 検索ボタンクリック時の処理を実装
    function search() {
        console.dir(searchCriteria);
        const result = searchStores(searchableStoreData, searchCriteria);
        setSearchResultsData(result);
    }

    function getCurrentPosition() {
        navigator.geolocation.getCurrentPosition((position) => {
            //緯度・経度
            let lat = position.coords.latitude;
            let lng = position.coords.longitude;
            setUserLocation({
                lat: lat,
                lng: lng
            })

            const searchableStoreDataHasDistance: SearchableStoreData = {
                stores: searchableStoreData.stores.map(store => {
                    const distance_from_user = distance(lat, lng, store)
                    return {
                        ...store,
                        distance_from_user: distance_from_user
                    }
                })
            };

            console.dir(searchableStoreDataHasDistance.stores);
            const result = searchableStoreDataHasDistance.stores.filter(store => {
                // 距離が30km以内
                return store.distance_from_user <= 30;
            });
            setSearchResultsData(result);
        });
    }

    function distance(lat1: number, lng1: number, store: Store) {
        const R = Math.PI / 180;
        lat1 *= R;
        lng1 *= R;
        let lat2 = store.latitude * R;
        let lng2 = store.longitude * R;

        // 「6371」という数値は、地球の半径をキロメートル単位で表したもの
        return 6371 * Math.acos(Math.cos(lat1) * Math.cos(lat2) * Math.cos(lng2 - lng1) + Math.sin(lat1) * Math.sin(lat2));
    }

    return (
        <div>
            <header id="global-header" className="">
                <div className="gh-inner"><h1 className="gh-logo"><a href=""></a>
                </h1>
                    <button id="gh-nav-icon" data-default="true"><span></span><span></span><span></span></button>
                    <nav id="global-nav">
                        <ul>
                            <li className="gnav-home">
                                <a href=""></a>
                            </li>
                            <li className="gnav-topic">
                                <a href=""></a>
                            </li>
                            <li className="gnav-store">
                                <a href="">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 72 22" width="72" height="22"
                                         className="option-menu__center">
                                        <title>店舗検索</title>
                                        <path
                                            d="M16.2 18.5c-.6 0-.6-.4-.6-.6v-.2H9.5c0 .5-.1.8-1 .8s-.6-.3-.6-.5v-4.1a11.5 11.5 0 00-.1-1.8v-.3l1.7.8h1.8v-4a15.3 15.3 0 00-.1-1.8v-.2l1.7.2c.1 0 .6.1.6.4s-.2.4-.6.5V9h2.8l.5-.8a.5.5 0 01.4-.2l.4.2 1.2 1 .2.3a.5.5 0 01-.5.4H13v2.5h2.6l.3-.5.3-.2h.3l1 .7a.5.5 0 01.2.4c0 .2-.1.3-.5.6v4.4c.1.5-.3.7-1 .7zm-.6-1.6v-3.6H9.5v3.6zM3.6 18v-.2c1.5-2.5 1.8-4.6 1.8-8.1v-5l1.7.8H11a17.4 17.4 0 000-1.9v-.2l1.7.2c.1 0 .6.1.6.4s-.1.4-.6.6v.9h3.5l.6-.8.4-.2h.4l1.2 1a.5.5 0 01.2.5.5.5 0 01-.5.4H7.3v3.4c0 5.3-1.5 7.3-2.9 8.5h-.1zM32.3 18.3c0-.6-.1-.7-1.2-1.1H31v.2c0 .5-.3.7-1 .7a.4.4 0 01-.5-.5v-3.3h-1.6v3.6c0 .4-.3.7-.9.7s-.6-.2-.6-.5V12h-6.3l-.4-1h2.9V9.5h-1.8l-.2-.5-.7.5h-.1l-.4-.4h.1a16.3 16.3 0 003.2-5.5v-.2l1.4.5c.4.1.6.3.6.5a.4.4 0 01-.1.3A6.5 6.5 0 0126.3 6h3.2v-.7a16.2 16.2 0 00-.1-1.8v-.2l1.5.2h.3v-.1h.2c.6.1 2.2.4 2.2 1.5v.3h.1l.9.7a.5.5 0 01.2.4c0 .2-.1.4-.5.4h-3.4v1.6h1.6l.2-.4.3-.2h.3l.9.7a.5.5 0 01.2.4c0 .2-.2.4-.5.6v7.7c0 1.1-.6 1.4-1.6 1.5h-.2zm-1.4-2.6v.9h1.6v-2.5h-1.6v1.6zm1.7-2.3v-1.8H31v1.8zm-3.1 0v-1.8h-1.6v1.8zm-4.1-2.9l.4.2.8.7V9.5a11.8 11.8 0 00-.1-1.6v-.4l1.6.8h1.5V6.8h-2.9a.8.8 0 01-.7.8c-.3 0-.4-.1-.8-.7A17.8 17.8 0 0024 5.2l-1 1.6 1.3.2c.2 0 .6.1.6.4s-.2.4-.6.5v.8h.2l.4-.5c0-.1.1-.2.3-.2l.4.2.8.7a.7.7 0 01.2.4.5.5 0 01-.5.4h-1.7v1.7h.5l.4-.5c-.2-.3-.1-.4.1-.4zm7.2.3V9.2H31v1.6zm-3.1 0V9.2h-1.6v1.6zm-8.3-2.2h1.6a6.7 6.7 0 00-.1-1.7 8 8 0 01-1.5 1.7zm11.5-2.7l.2-.2-.7-.7-.7-.8c-.1.2-.2.3-.6.4V6h1.8zM21.5 18.5c-.4 0-.6-.2-.6-.5v-3.2a10.9 10.9 0 00-.1-1.9v-.4l1.5.8h2.2l.2-.4.3-.2h.3l.8.6c.1.1.3.2.3.4s-.1.4-.5.5v3.2c0 .2-.1.7-1 .7s-.5-.4-.5-.6h-2.2v.3c.2.4-.1.7-.7.7zm3.1-1.9v-2.5h-2.2v2.5zM40.3 18.1h.1c3-1.5 3.9-3 4.2-4.2h-1.4c0 .4-.2.7-.9.7s-.6-.3-.6-.5v-2.9a9.2 9.2 0 00-.1-1.5v-.3l1.6.7h1.6V8.7h-2.3l-.2-.4-1.6.8h-.2l-.3-.4h.1l.8-.7h-1.8v1.2c1.3.6 2 1.4 2 2.2s-.4 1-.7 1-.5-.2-.7-.8l-.5-1.1V18c0 .2 0 .8-.9.8s-.6-.4-.6-.6V12a13.4 13.4 0 01-2.2 3.2h-.1l-.5-.3v-.2A23.6 23.6 0 0037.7 8h-2.1l-.4-1h2.6V5.4a14.4 14.4 0 00-.1-1.8v-.2l1.5.2c.5.1.6.3.6.5s-.3.4-.6.5v2.6h.5l.4-.6c0-.1.1-.2.4-.2a.5.5 0 01.4.2l.8.7h.1a10.6 10.6 0 002.6-3.9v-.1l1.5.6a.5.5 0 01.4.5.5.5 0 01-.3.4 8.7 8.7 0 004.7 2.5h.3v.5h-.1a1.5 1.5 0 00-1 1V9h-.2l-1-.6c0 .1 0 .4-.5.4h-2v1.4h1.7l.3-.4c0-.1.1-.2.3-.2h.3l.8.6c.1.1.3.2.3.4s-.2.4-.5.6v2.6c0 .3-.1.7-1 .7s-.5-.2-.5-.5H46a6.5 6.5 0 004.5 2.9h.2v.5h-.1a1.7 1.7 0 00-1.1 1v.2h-.2a7.5 7.5 0 01-3.7-3.8c-.8 2-2.5 3.3-5.2 3.9h-.2zm7.9-5.1v-2.1h-1.7c0 .7-.1 1.4-.1 2.1zm-3.4 0a14.8 14.8 0 00.1-2.1h-1.7V13zm-1.4-5.2h3.3l.4-.6a.2.2 0 01.2-.2 10.1 10.1 0 01-1.5-1.8 10.6 10.6 0 01-2.4 2.6zM59.2 18.6a.5.5 0 01-.6-.6v-3.9l-4.7.4c-.1.2-.2.5-.5.5s-.3-.2-.4-.5l-.5-1.6h5.9A21.1 21.1 0 0061.5 9v-.2l1.3.7c.3.2.4.3.4.5s-.1.4-.6.4h-.2a21.3 21.3 0 01-2.8 2.3l3.8-.2h.2l-1.2-1h-.2l.3-.5h.2c3.3 1.1 3.6 2.4 3.6 2.7a.7.7 0 01-.7.8c-.4 0-.5-.2-.8-.6l-.6-.8-4.1.6v3.9c0 .5-.1 1-.9 1zm-6.9-.8h.2a12.2 12.2 0 003.7-3.1v-.2l1.2 1a.7.7 0 01.2.4.4.4 0 01-.4.4h-.4a12.7 12.7 0 01-4.2 2.1h-.2zM65 18c-.3 0-.5-.1-1-.8a14.2 14.2 0 00-2.8-2.3h-.1l.2-.5h.2c2.7.7 4.3 1.7 4.3 2.8s-.5.8-.8.8zm-7.1-5.4c-.4 0-.6-.3-1-.7a8.5 8.5 0 00-2.3-2h-.1l.2-.5h.2a7.9 7.9 0 012 .7 8.9 8.9 0 00.9-1.6h-3.7a3 3 0 01-.5 1.8 1.2 1.2 0 01-.8.4.7.7 0 01-.8-.7c0-.2.1-.4.5-1a4.6 4.6 0 00.9-2.1v-.3h.5v.2c0 .2.1.4.1.7h4.5V6.2h-6l-.4-1h6.4a11.6 11.6 0 00-.1-1.7l1.6.2c.2 0 .6.1.6.4s-.2.4-.6.6v.8h3.7l.5-.8c.1-.2.2-.2.4-.2l.4.2 1.2 1a.5.5 0 01.2.4c0 .3-.2.4-.5.4H60V8h4.5l.4-.5a.5.5 0 01.8 0l1 .9a.5.5 0 01.2.4c0 .4-.3.4-.9.5l-1.6 1.3h-.1l-.4-.3v-.2c.3-.5.4-1 .6-1.3h-5.1a.5.5 0 01.4.5c0 .4-.3.4-.8.4l-1.2 1a1.8 1.8 0 01.9 1.3.9.9 0 01-.8.6z"></path>
                                    </svg>
                                </a>
                            </li>
                            <li className="gnav-menu">
                                <a href=""></a>
                            </li>
                            <li className="gnav-takeout">
                                <a href=""></a>
                            </li>
                        </ul>
                    </nav>
                </div>
            </header>

            <main>
                <header className="page-header-hero">
                    <h1 className="page-heading">
                        <div className="d-pc-none">
                        </div>
                    </h1>
                </header>
                <section id="mainContainer">
                    <div id="areaFilter">
                        <p id="areaFilterTitle"
                           className="section-title">エリアから探す(GPS以外はかざり)</p>
                        <div id="searchCurrentLocationBtn" style={{"width": "100%", "cursor": "pointer"}}
                             onClick={getCurrentPosition}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 16 16">
                                <path id="パス_274" data-name="パス 274"
                                      d="M1021.225,1215.95l14.917-7.5a.539.539,0,0,1,.729.714l-7.11,14.919a.538.538,0,0,1-1.009-.1l-1.236-5.083a.541.541,0,0,0-.388-.4l-5.8-1.537A.542.542,0,0,1,1021.225,1215.95Z"
                                      transform="translate(-1020.926 -1208.386)">

                                </path>
                            </svg>
                            現在地から探す(30km以内)
                        </div>

                        {
                            (userLocation.lat != 0 && userLocation.lng != 0) &&
                            <div id="searchCurrentLocationBtn" style={{"width": "100%", "cursor": "pointer"}}><span>現在地 緯度: {userLocation.lat} 経度: {userLocation.lng}</span>
                            </div>
                        }

                        <div id="areaList">
                            <div className="area-btn" data-loop-iteration="1">
                                <span>全国</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="2">
                                <span>北海道・東北</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="3">
                                <span>関東</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="4">
                                <span>北陸・甲信越</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="5">
                                <span>東海</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="6">
                                <span>関西</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="7">
                                <span>中国</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="8">
                                <span>四国</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                            <div className="area-btn" data-loop-iteration="9">
                                <span>九州・沖縄</span>
                                <svg xmlns="http://www.w3.org/2000/svg" width="10" height="8" viewBox="0 0 10 8">
                                    <path id="Polygon49" data-name="Polygon 49" d="M5,0l5,8H0Z"
                                          transform="translate(10 8) rotate(180)" fill="#FFF"></path>
                                </svg>
                            </div>
                        </div>
                        <div className="prefecture-list-pc">
                            <div className="list-container" data-loop-iteration="1" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/hokkaido" className="prefecture-btn opacity-50-sp">北海道</a>
                                    <a href="/aomori" className="prefecture-btn opacity-50-sp">青森県</a>
                                    <a href="/iwate" className="prefecture-btn opacity-50-sp">岩手県</a>
                                    <a href="/miyagi" className="prefecture-btn opacity-50-sp">宮城県</a>
                                    <a href="/akita" className="prefecture-btn opacity-50-sp">秋田県</a>
                                    <a href="/yamagata" className="prefecture-btn opacity-50-sp">山形県</a>
                                    <a href="/fukushima" className="prefecture-btn opacity-50-sp">福島県</a>
                                    <a href="/ibaraki" className="prefecture-btn opacity-50-sp">茨城県</a>
                                    <a href="/tochigi" className="prefecture-btn opacity-50-sp">栃木県</a>
                                    <a href="/gunma" className="prefecture-btn opacity-50-sp">群馬県</a>
                                    <a href="/saitama" className="prefecture-btn opacity-50-sp">埼玉県</a>
                                    <a href="/chiba" className="prefecture-btn opacity-50-sp">千葉県</a>
                                    <a href="/tokyo" className="prefecture-btn opacity-50-sp">東京都</a>
                                    <a href="/kanagawa" className="prefecture-btn opacity-50-sp">神奈川県</a>
                                    <a href="/niigata" className="prefecture-btn opacity-50-sp">新潟県</a>
                                    <a href="/toyama" className="prefecture-btn opacity-50-sp">富山県</a>
                                    <a href="/ishikawa" className="prefecture-btn opacity-50-sp">石川県</a>
                                    <a href="/fukui" className="prefecture-btn opacity-50-sp">福井県</a>
                                    <a href="/yamanashi" className="prefecture-btn opacity-50-sp">山梨県</a>
                                    <a href="/nagano" className="prefecture-btn opacity-50-sp">長野県</a>
                                    <a href="/gifu" className="prefecture-btn opacity-50-sp">岐阜県</a>
                                    <a href="/shizuoka" className="prefecture-btn opacity-50-sp">静岡県</a>
                                    <a href="/aichi" className="prefecture-btn opacity-50-sp">愛知県</a>
                                    <a href="/mie" className="prefecture-btn opacity-50-sp">三重県</a>
                                    <a href="/shiga" className="prefecture-btn opacity-50-sp">滋賀県</a>
                                    <a href="/kyoto" className="prefecture-btn opacity-50-sp">京都府</a>
                                    <a href="/osaka" className="prefecture-btn opacity-50-sp">大阪府</a>
                                    <a href="/hyogo" className="prefecture-btn opacity-50-sp">兵庫県</a>
                                    <a href="/nara" className="prefecture-btn opacity-50-sp">奈良県</a>
                                    <a href="/wakayama" className="prefecture-btn opacity-50-sp">和歌山県</a>
                                    <a href="/tottori" className="prefecture-btn opacity-50-sp">鳥取県</a>
                                    <a href="/shimane" className="prefecture-btn opacity-50-sp">島根県</a>
                                    <a href="/okayama" className="prefecture-btn opacity-50-sp">岡山県</a>
                                    <a href="/hiroshima" className="prefecture-btn opacity-50-sp">広島県</a>
                                    <a href="/yamaguchi" className="prefecture-btn opacity-50-sp">山口県</a>
                                    <a href="/tokushima" className="prefecture-btn opacity-50-sp">徳島県</a>
                                    <a href="/kagawa" className="prefecture-btn opacity-50-sp">香川県</a>
                                    <a href="/ehime" className="prefecture-btn opacity-50-sp">愛媛県</a>
                                    <a href="/kochi" className="prefecture-btn opacity-50-sp">高知県</a>
                                    <a href="/fukuoka" className="prefecture-btn opacity-50-sp">福岡県</a>
                                    <a href="/saga" className="prefecture-btn opacity-50-sp">佐賀県</a>
                                    <a href="/nagasaki" className="prefecture-btn opacity-50-sp">長崎県</a>
                                    <a href="/kumamoto" className="prefecture-btn opacity-50-sp">熊本県</a>
                                    <a href="/oita" className="prefecture-btn opacity-50-sp">大分県</a>
                                    <a href="/miyazaki" className="prefecture-btn opacity-50-sp">宮崎県</a>
                                    <a href="/kagoshima" className="prefecture-btn opacity-50-sp">鹿児島県</a>
                                    <a href="/okinawa" className="prefecture-btn opacity-50-sp">沖縄県</a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="2" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/hokkaido" className="prefecture-btn opacity-50-sp">北海道</a>
                                    <a href="/aomori" className="prefecture-btn opacity-50-sp">青森県</a><a
                                    href="/iwate" className="prefecture-btn opacity-50-sp"> 岩手県 </a> <a
                                    href="/miyagi" className="prefecture-btn opacity-50-sp"> 宮城県 </a> <a
                                    href="/akita" className="prefecture-btn opacity-50-sp"> 秋田県 </a> <a
                                    href="/yamagata" className="prefecture-btn opacity-50-sp"> 山形県 </a> <a
                                    href="/fukushima" className="prefecture-btn opacity-50-sp"> 福島県 </a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="3" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/ibaraki" className="prefecture-btn opacity-50-sp"> 茨城県 </a>
                                    <a href="/tochigi" className="prefecture-btn opacity-50-sp"> 栃木県 </a>
                                    <a href="/gunma" className="prefecture-btn opacity-50-sp"> 群馬県 </a>
                                    <a href="/saitama" className="prefecture-btn opacity-50-sp"> 埼玉県 </a>
                                    <a href="/chiba" className="prefecture-btn opacity-50-sp"> 千葉県 </a>
                                    <a href="/tokyo" className="prefecture-btn opacity-50-sp"> 東京都 </a>
                                    <a href="/kanagawa" className="prefecture-btn opacity-50-sp"> 神奈川県 </a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="4" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/niigata" className="prefecture-btn opacity-50-sp"> 新潟県 </a>
                                    <a href="/toyama" className="prefecture-btn opacity-50-sp"> 富山県 </a>
                                    <a href="/ishikawa" className="prefecture-btn opacity-50-sp"> 石川県 </a>
                                    <a href="/fukui" className="prefecture-btn opacity-50-sp"> 福井県 </a>
                                    <a href="/yamanashi" className="prefecture-btn opacity-50-sp"> 山梨県 </a>
                                    <a href="/nagano" className="prefecture-btn opacity-50-sp"> 長野県 </a></div>
                            </div>
                            <div className="list-container" data-loop-iteration="5" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/gifu" className="prefecture-btn opacity-50-sp"> 岐阜県 </a>
                                    <a href="/shizuoka" className="prefecture-btn opacity-50-sp"> 静岡県 </a>
                                    <a href="/aichi" className="prefecture-btn opacity-50-sp"> 愛知県 </a>
                                    <a href="/mie" className="prefecture-btn opacity-50-sp"> 三重県 </a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="6" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container"><a href="/shiga"
                                                                         className="prefecture-btn opacity-50-sp"> 滋賀県 </a>
                                    <a href="/kyoto" className="prefecture-btn opacity-50-sp"> 京都府 </a> <a
                                        href="/osaka" className="prefecture-btn opacity-50-sp"> 大阪府 </a> <a
                                        href="/hyogo" className="prefecture-btn opacity-50-sp"> 兵庫県 </a> <a
                                        href="/nara" className="prefecture-btn opacity-50-sp"> 奈良県 </a> <a
                                        href="/wakayama" className="prefecture-btn opacity-50-sp"> 和歌山県 </a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="7" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container"><a href="/tottori"
                                                                         className="prefecture-btn opacity-50-sp"> 鳥取県 </a>
                                    <a href="/shimane" className="prefecture-btn opacity-50-sp"> 島根県 </a> <a
                                        href="/okayama" className="prefecture-btn opacity-50-sp"> 岡山県 </a> <a
                                        href="/hiroshima" className="prefecture-btn opacity-50-sp"> 広島県 </a> <a
                                        href="/yamaguchi" className="prefecture-btn opacity-50-sp"> 山口県 </a>
                                </div>
                            </div>
                            <div className="list-container" data-loop-iteration="8" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/tokushima"
                                       className="prefecture-btn opacity-50-sp"> 徳島県 </a>
                                    <a href="/kagawa" className="prefecture-btn opacity-50-sp"> 香川県 </a> <a
                                    href="/ehime" className="prefecture-btn opacity-50-sp"> 愛媛県 </a> <a
                                    href="/kochi" className="prefecture-btn opacity-50-sp"> 高知県 </a></div>
                            </div>
                            <div className="list-container" data-loop-iteration="9" style={{"display": "none"}}>
                                <div className="filter-seperator">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="3000" height="12"
                                         viewBox="0 0 3000 13.401">
                                        <path id="多角形_45" data-name="多角形 45"
                                              d="M-20,274.583H1457.5l8,12,8-12H2980"
                                              transform="translate(20 -274.083)" fill="none" stroke="#7f7f7f"
                                              strokeMiterlimit="10" strokeWidth="1"></path>
                                    </svg>
                                </div>
                                <div className="prefecture-container">
                                    <a href="/fukuoka" className="prefecture-btn opacity-50-sp"> 福岡県 </a>
                                    <a href="/saga" className="prefecture-btn opacity-50-sp"> 佐賀県 </a> <a
                                    href="/nagasaki" className="prefecture-btn opacity-50-sp"> 長崎県 </a> <a
                                    href="/kumamoto" className="prefecture-btn opacity-50-sp"> 熊本県 </a> <a
                                    href="/oita" className="prefecture-btn opacity-50-sp"> 大分県 </a> <a
                                    href="/miyazaki" className="prefecture-btn opacity-50-sp"> 宮崎県 </a> <a
                                    href="/kagoshima" className="prefecture-btn opacity-50-sp"> 鹿児島県 </a> <a
                                    href="/okinawa" className="prefecture-btn opacity-50-sp"> 沖縄県 </a></div>
                            </div>
                        </div>
                    </div>
                    <div className="filter-checkbox">
                        <div className="search-key-word">
                            <div className="title-key-word section-title"> キーワードで探す</div>
                            <div className="input-key-word">
                                <input id="keywordPC" name="keyword" type="text"
                                       value={searchCriteria.keyword}
                                       onChange={(e) => setSearchCriteria({
                                           ...searchCriteria,
                                           keyword: e.target.value
                                       })} placeholder="店名・住所・電話番号を入力"/>
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20">
                                    <g id="Group_3299" data-name="Group 3299" transform="translate(-251 -321)">
                                        <circle id="Ellipse_3" data-name="Ellipse 3" cx="10" cy="10" r="10"
                                                transform="translate(251 321)" fill="#434343" opacity="0.243"></circle>
                                        <g id="Group_2210" data-name="Group 2210" transform="translate(1.5 30.5)">
                                            <line id="Line_17" data-name="Line 17" x2="10" y2="10"
                                                  transform="translate(254.5 295.5)" fill="none" stroke="#fff"
                                                  strokeWidth="2"></line>
                                            <line id="Line_18" data-name="Line 18" x1="10" y2="10"
                                                  transform="translate(254.5 295.5)" fill="none" stroke="#fff"
                                                  strokeWidth="2"></line>
                                        </g>
                                    </g>
                                </svg>
                            </div>
                        </div>
                        <div className="checkbox-services">
                            <div className="title-key-word section-title">条件で絞り込んで探す</div>
                            <div className="list-services row">
                                <div className="list-services__left col-2 font-weight-bold">提供サービス</div>
                                <div className="list-services__right row col-10">
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service156"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.parking}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       parking: e.target.checked
                                                   })}
                                                   value="駐⾞場完備（無料/有料）"
                                                   data-name="駐⾞場完備（無料/有料）"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service156" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.parking ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>駐⾞場完備（無料/有料）</span></label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service157"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.barrierFree}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       barrierFree: e.target.checked
                                                   })}
                                                   value="バリアフリー対応"
                                                   data-name="バリアフリー対応"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service157" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.barrierFree ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>バリアフリー対応</span> </label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service158"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.cashless}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       cashless: e.target.checked
                                                   })}
                                                   value="キャッシュレス対応"
                                                   data-name="キャッシュレス対応"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service158" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.cashless ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>キャッシュレス対応</span> </label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service159"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.foodProvider}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       foodProvider: e.target.checked
                                                   })}
                                                   value="フードプロバイダー"
                                                   data-name="フードプロバイダー"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service159" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.foodProvider ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>フードプロバイダー</span> </label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service160"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.freeWifi}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       freeWifi: e.target.checked
                                                   })}
                                                   value="Free Wi-Fi完備"
                                                   data-name="Free Wi-Fi完備"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service160" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.freeWifi ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>Free Wi-Fi完備</span> </label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service161"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.demaeCan}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       demaeCan: e.target.checked
                                                   })}
                                                   value="出前館"
                                                   data-name="出前館"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service161" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.demaeCan ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>出前館</span></label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service162"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.uber}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       uber: e.target.checked
                                                   })}
                                                   value="Uber"
                                                   data-name="Uber"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service162" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.uber ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>Uber</span></label></div>
                                    </div>
                                    <div className="services-item mb-3 p-0">
                                        <div className="checkbox-item-services">
                                            <input type="checkbox"
                                                   id="service163"
                                                   className="filter-box check-mark-services"
                                                   checked={searchCriteria.walt}
                                                   onChange={(e) => setSearchCriteria({
                                                       ...searchCriteria,
                                                       walt: e.target.checked
                                                   })}
                                                   value="Walt" data-name="Walt"
                                                   data-service-name="services"
                                                   hidden={true}
                                            />
                                        </div>
                                        <div className="title-service opacity-50 opacity-50-sp"><label
                                            htmlFor="service163" className="mb-0 d-flex align-items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20"
                                                 viewBox="0 0 20 20"
                                                 style={{opacity: searchCriteria.walt ? 1 : undefined}}>
                                                <g id="グループ_2366" data-name="グループ 2366"
                                                   transform="translate(-164 -304)">
                                                    <rect id="Selectbox.BG" width="20" height="20" rx="10"
                                                          transform="translate(164 304)" fill="#000000"></rect>
                                                    <path id="パス_26" data-name="パス 26"
                                                          d="M1711.476,459.031l-5.5-5.559,1.426-1.441,4.074,4.118,7.235-7.279,1.426,1.441Z"
                                                          transform="translate(-1539.476 -139.87)" fill="#fff"></path>
                                                </g>
                                            </svg>
                                            <span>Walt</span> </label></div>
                                    </div>
                                </div>
                            </div>
                            <div className="button-filter w-100 d-flex justify-content-center">
                                <div className="button-filter__clear" id="btnReset">リセット</div>
                                <div className="button__search"
                                     id="btnSearch"
                                     onClick={search}>
                                    このキーワード・絞り込みで検索
                                </div>
                            </div>

                            <div className="button-filter w-100 d-flex justify-content-center"
                                 style={{marginTop: "12px"}}>
                                Result
                            </div>

                            <div className="button-filter w-100 d-flex justify-content-center"
                                 style={{marginTop: "12px"}}>
                                <div className="">
                                    <ul>
                                        {searchResultsData.map(store => (
                                            <li key={store.store_id}>
                                                {store.store_name} / {store.phone_number} / {store.address} /
                                                緯度 {store.latitude} : 経度 {store.longitude} :
                                                現在地からの距離 {store.distance_from_user}
                                            </li>
                                        ))}
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    );
}
