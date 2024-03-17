import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useRecoilState, useSetRecoilState } from "recoil";
import { styled } from "styled-components";
import { fetchCoins } from "../api";
import { isDarkAtom } from "../atom";

const Title = styled.h1`
    color:${props=>(props.theme.accentColor)}
`
const Coin = styled.li`
    display:block;
    margin-top:5px;    
    border-radius:8px;
    font-size:18px;
    background-color:${props=>(props.theme.textColor)};
    color:${props=>(props.theme.bgColor)};
    a{
        display:flex;
        align-items:center;
        padding:20px;
    }
    &:hover{
        a{
            color:${props=>(props.theme.accentColor)}
        }
    }
`
const CoinList = styled.ul`
    margin:0;
    padding:0;
`
const Header = styled.h1`
    position:relative;
    display:flex;
    justify-content: center;
    margin:10px 0;
    font-size:20px;
`
const Cointainer = styled.div`
    max-width:640px;    
    margin:20px auto;
`
const Img = styled.img`
    display:inline-block;
    width:25px;
    height:auto;
    margin-right:8px;
`
const Btn = styled.button`
    position: absolute;
    right: 0;
    top: 25px;
    height:40px;
    padding:0 20px;
    background:none;
    border:none;
    border-radius:30px;
    background-color:${props=>(props.theme.textColor)};
    color:${props=>(props.theme.bgColor)};
`

interface Icoins{
    id: string,
    name: string,
    symbol: string,
    rank: number,
    is_new: boolean,
    is_active: boolean,
    type: string,
}

function Coins(){
    const [isDark, setIsDark] = useRecoilState(isDarkAtom);
    const setDarkAtom = useSetRecoilState(isDarkAtom);
    const toggleDarkAtom = () => setDarkAtom(prev => !prev);
    const {isLoading,data} = useQuery<Icoins[]>("allCoins",fetchCoins)
    // const [coins,setCoins] = useState<Icoins[]>([]);
    // const [loading, setLoading] = useState(true);
    // useEffect(() => {
    //     (async() => {
    //         const response = await fetch("https://api.coinpaprika.com/v1/coins");
    //         const json = await response.json();
    //         setCoins(json.slice(0,100))
    //         setLoading(false);
    //     })();
    // },[])


    return (
        <Cointainer>
            <Header>
                <Title>코인</Title>   
                <Btn onClick={toggleDarkAtom}>
                    {isDark ? '☀️ LightMode' : '🌙 DarkMode'}
                </Btn> 
            </Header>                    
            {isLoading ? (
                "loading"
            ) : (
                <CoinList>                
                    {data?.slice(0,100).map((coin)=>(
                        <Coin key={coin.id}>                        
                            <Link to={{
                                pathname: `${coin.id}`,
                                state : {name:coin.name},
                            }}>
                                <Img src={`https://raw.githubusercontent.com/ErikThiart/cryptocurrency-icons/master/64/${coin.name.toLowerCase().replace(/\s+/g, '-')+".png"}`} />
                                {coin.name} &rarr;
                            </Link>
                        </Coin>
                    ))}               
                </CoinList>  
            )}
                      
        </Cointainer>
    )
}

export default Coins;
