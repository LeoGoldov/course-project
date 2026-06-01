// frontend/src/hooks/useTeamsQuery.js
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import axios from 'axios';

// Получение списка команд
export const useTeams = (page = 1, search = '') => {
  return useQuery({
    queryKey: ['teams', page, search],
    queryFn: async () => {
      const url = search
        ? `/api/teams/?page=${page}&search=${search}`
        : `/api/teams/?page=${page}`;
      const response = await axios.get(url);
      let teamsData = Array.isArray(response.data) ? response.data : (response.data.results || []);
      // Фильтруем только опубликованные
      teamsData = teamsData.filter(team => team.is_published === true);
      return {
        teams: teamsData,
        count: response.data.count,
        totalPages: Math.ceil((response.data.count || 0) / 10)
      };
    },
    staleTime: 30000, // 30 секунд кэш
  });
};

// Получение одной команды
export const useTeam = (id) => {
  return useQuery({
    queryKey: ['team', id],
    queryFn: async () => {
      const response = await axios.get(`/api/teams/${id}/`);
      return response.data;
    },
    enabled: !!id,
    staleTime: 60000,
  });
};

// Создание команды
export const useCreateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data) => axios.post('/api/teams/', data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

// Обновление команды
export const useUpdateTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id, data }) => axios.patch(`/api/teams/${id}/`, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
      queryClient.invalidateQueries({ queryKey: ['team', variables.id] });
    },
  });
};

// Удаление команды
export const useDeleteTeam = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (id) => axios.delete(`/api/teams/${id}/`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['teams'] });
    },
  });
};

// Мои команды
export const useMyTeams = () => {
  return useQuery({
    queryKey: ['myTeams'],
    queryFn: async () => {
      const response = await axios.get('/api/teams/my_teams/');
      return response.data;
    },
    staleTime: 30000,
  });
};