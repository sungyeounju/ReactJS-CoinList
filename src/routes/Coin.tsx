import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Switch, Route, useLocation, useParams, Link, useRouteMatch } from "react-router-dom";
import { styled } from "styled-components";
import { fetchCoinInfo, fetchCoinTicker } from "../api";
import Helmet from "react-helmet";
import Chart from "./Chart";
import Price from "./Price";

const Header = styled.h1`
    margin:10px 0;
    font-size:20px;
    text-align:center;
`
const Title = styled.h1`
    color:${props=>(props.theme.accentColor)}
`
const Cointainer = styled.div`
    max-width:640px;    
    margin:20px auto;
`
const Overview = styled.div`
    display:flex;
    width:100%;
    padding:20px;
    border-radius:10px;
    background:${props=>(props.theme.textColor)};
    color:${props=>(props.theme.bgColor)};
    font-size:18px;
    line-height:25px;
`
const OverviewItem = styled.div`
    display:flex;
    flex-direction: column;
    width:100%;
    text-align:center;
`
const Description = styled.div`
    margin:20px 0;
`
const Tabs = styled.div`
    display:flex;
    align-items: center;
    justify-content: space-around;
    margin:20px 0;
    text-align:center;
    background:#ddd;
    border-radius:5px;
`
const Tab = styled.span<{isActive:boolean}>`
    display:block;
    width:100%;
    height:100%;
    font-size:18px;
    color:${props => props.isActive ? props.theme.textColor : "#aeb2b7"};
    font-weight:${props => props.isActive ? "bold" : "normal"};
    a{
        display:block;
        height:100%;
        padding:15px 0;
    }
`
const Prebtn = styled.button`
    display:block;
    position:absolute;
    left:0;
    top:0;
    width:100px;
    height:100px;
`
interface Params{
    coinId: string;
}
interface RouteState{
    name : string;
}
interface InfoData{
    id:string;
    name:string;
    symbol:string;
    rank:number;
    is_new:boolean;
    is_active:boolean;
    type:string;
    contract:string;
    platform:string;
    contracts:object;
    logo:string;
    description:string;
    message:string;
    open_source:boolean;
    started_at:string;
    development_status:string;
    hardware_wallet:boolean;
    proof_type:string;
    org_structure:string;
    hash_algorithm:string;
    first_data_at:string;
    last_data_at:string;
}
interface PriceData{
    id :  string;
    name :  string;
    symbol :  string;
    rank :  number;
    circulating_supply :  number;
    total_supply :  number;
    max_supply :  number;
    beta_value :  number;
    first_data_at :  string;
    last_updated :  string;
}

function Coin(){
    const {coinId} = useParams<Params>();
    const {state} = useLocation<RouteState>();
    const priceMatch = useRouteMatch("/:conId/price");
    const chartMatch = useRouteMatch("/:conId/chart");
    const {isLoading:infoLoading, data : infoData} = useQuery<InfoData>(
        ["info", coinId], () => fetchCoinInfo(coinId)
    );
    const {isLoading:tickersLoading, data : tickersData} = useQuery<PriceData>(
        ["tickers", coinId], () => fetchCoinTicker(coinId)
    );
    /*
    const [loading, setLoading] = useState(true);
    const [info, setInfo] = useState<InfoData>();
    const [priceinfo, setPriceInfo] = useState<PriceData>();
    useEffect(()=>{
        (async () => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            console.log(infoData);
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            console.log(priceData);
            setInfo(infoData);
            setPriceInfo(priceData);
            setLoading(false)
        })();
    },[coinId]);
    */
    const loading = infoLoading || tickersLoading
    return (
        <Cointainer>
            <Helmet>
                <title>
                    {state?.name ? state.name : loading ? "loading" : infoData?.name}
                </title>
            </Helmet>
            <Header>
                <Title>코인 {state?.name || "loading"}</Title>
            </Header>
            <Prebtn>
                <Link to="/">뒤로가기</Link>
            </Prebtn>
            {
                loading ? (
                    "Loading..."
                ) : (
                    <>
                        <Overview>
                            <OverviewItem>
                                <span>rank : </span>
                                <span>{infoData?.rank}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>symbol :</span>
                                <span>{infoData?.symbol}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Price : </span>
                                <span>00.</span>
                            </OverviewItem>
                        </Overview> 
                            <Description>
                                <span>{infoData?.description}</span>
                            </Description>
                        <Overview>
                            <OverviewItem>
                                <span>Total syply : </span>
                                <span>{tickersData?.total_supply}</span>
                            </OverviewItem>
                            <OverviewItem>
                                <span>Max supply : </span>
                                <span>{tickersData?.max_supply}</span>
                            </OverviewItem>
                        </Overview>
                        <Tabs>
                            <Tab isActive={chartMatch !== null}>
                                <Link to={`/${coinId}/chart`}>Chart</Link>
                            </Tab>
                            <Tab isActive={priceMatch !== null}>
                                <Link to={`/${coinId}/price`}>Price</Link>
                            </Tab>                            
                        </Tabs>
                        <Switch>
                            <Route path={`/${coinId}/price`}>
                                <Price></Price>
                            </Route>
                            <Route path={`/${coinId}/chart`}>
                                <Chart coinId={coinId}/>
                            </Route>
                        </Switch>
                    </>
                )
            }
        </Cointainer>
    )
}
export default Coin;