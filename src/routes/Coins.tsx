import { useEffect, useState } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";
import { useSetRecoilState } from "recoil";
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
                <button onClick={toggleDarkAtom}>Toggle Mode</button> 
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
                                <Img src={`https://coinicons-api.vercel.app/api/icon/${coin.symbol.toLowerCase()}`} />
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
