import ApiHelper from "./ApiHelper";

export const GetPokemonDetailInformation: any = (id: number) => ApiHelper.get(`pokemon/${id}`)

export const GetMoveDetailInformation: any = (id: number) => ApiHelper.get(`move/${id}`)

export const GetAbilityInformation: any = (id: number) => ApiHelper.get(`ability/${id}`)

export const GetSpicyDetailInformation: any = (id: number) => ApiHelper.get(`pokemon-species/${id}`)

export const GetEvolutionInformation: any = (id) => ApiHelper.get(`evolution-chain/${id}`)

export const GetPokemonList: any = (offset) => ApiHelper.get(`pokemon?offset=${offset}&limit=30`)