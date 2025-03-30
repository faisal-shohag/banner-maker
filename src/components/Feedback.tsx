// components/FeedbackSection.tsx
'use client';

import React, { useState, FormEvent } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import InfiniteScroll from 'react-infinite-scroll-component';
import { supabase, Feedback } from '@/utils/supabase';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';

const FeedbackSection: React.FC = () => {
  const [name, setName] = useState<string>('');
  const [comment, setComment] = useState<string>('');
  const ITEMS_PER_PAGE = 10;

  const queryClient = useQueryClient();

  const fetchFeedbacks = async ({ pageParam = 1 }: { pageParam?: number }) => {
    const from = (pageParam - 1) * ITEMS_PER_PAGE;
    const to = from + ITEMS_PER_PAGE - 1;

    const { data, error } = await supabase
      .from('bannerfeedbacks')
      .select('name, comment, created_at') // Added created_at
      .order('created_at', { ascending: false }) // Latest first
      .range(from, to);

    if (error) {
      console.error('Error fetching feedbacks:', error);
      throw new Error(error.message);
    }
    return data as Feedback[];
  };

  const submitFeedback = async (newFeedback: Omit<Feedback, 'id' | 'created_at'>) => {
    const { data, error } = await supabase
      .from('bannerfeedbacks')
      .insert([newFeedback])
      .select();

    if (error) {
      console.error('Error submitting feedback:', error);
      throw new Error(error.message);
    }
    return data as Feedback[];
  };

  const { 
    data,
    hasNextPage,
    fetchNextPage,
    isFetchingNextPage,
    isError,
    error,
  } = useInfiniteQuery({
    queryKey: ['feedbacks'],
    queryFn: fetchFeedbacks,
    initialPageParam: 1,
    getNextPageParam: (lastPage: Feedback[], allPages: Feedback[][]) => {
      return lastPage.length === ITEMS_PER_PAGE ? allPages.length + 1 : undefined;
    },
  });

  const feedbacks = data?.pages.flat() ?? [];

  const mutation = useMutation({
    mutationFn: submitFeedback,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['feedbacks'] });
      setName('');
      setComment('');
    },
    onError: (error) => {
      console.error('Submission error:', error);
    },
  });

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!name.trim() || !comment.trim()) return;
    
    mutation.mutate({
      name: name.trim(),
      comment: comment.trim(),
    });
  };

 

  return (
    <div className="font-kalpurush mx-auto  space-y-8">
      {/* Feedback Form */}
      <Card className="shadow-lg border-none bg-white">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className=" font-bold text-gray-800 ">একটা কিছু বলে যান!</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Input
                placeholder="Your Name"
                value={name}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                required
                className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="space-y-2">
              <Textarea
                placeholder="Your feedback..."
                value={comment}
                onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setComment(e.target.value)}
                rows={5}
                required
                className="w-full border-gray-300 focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <Button 
              type="submit" 
              disabled={mutation.isPending}
              className="w-full bg-indigo-600 hover:bg-indigo-700 transition-colors duration-200"
            >
              {mutation.isPending ? 'Submitting...' : 'Submit Feedback'}
            </Button>
            {mutation.isError && (
              <p className="text-red-500 text-sm text-center">
                Error: {(mutation.error as Error).message}
              </p>
            )}
          </form>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card className="shadow-lg border-none bg-white font-kalpurush">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50">
          <CardTitle className=" font-bold text-gray-800 ">কিছু কথামালা...</CardTitle>
        </CardHeader>
        <CardContent className="pt-6">
          {isError && (
            <p className="text-red-500 text-center mb-4">
              Error: {(error as Error).message}
            </p>
          )}
          <InfiniteScroll
            dataLength={feedbacks.length}
            next={fetchNextPage}
            hasMore={hasNextPage ?? false}
            loader={<h4 className="text-center text-gray-500">Loading...</h4>}
            endMessage={<p className="text-center text-gray-500 mt-4 font-kalpurush">{feedbacks.length==0 ? "কেউ কিছু বলেনি...!" : "আর কিছু নেই..."}</p>}
          >
            <div className="space-y-6">
              {feedbacks.map((feedback: Feedback, index: number) => (
                <div 
                  key={index} 
                  className="flex items-start space-x-3 pb-6 border-b border-gray-100 last:border-b-0 hover:bg-gray-50 p-4 rounded-lg transition-colors duration-150 border shadow"
                >
                  <Avatar className="w-8 h-8">
                    <AvatarFallback className="bg-indigo-100 text-indigo-600">
                      {feedback.name.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="font-semibold text-gray-800 text-sm">{feedback.name}</p>
                      <p className="text-xs text-gray-500">
                        {feedback.created_at 
                          ? formatDistanceToNow(new Date(feedback.created_at), { addSuffix: true })
                          : 'Just now'}
                      </p>
                    </div>
                    <p className="text-gray-600 mt-1">{feedback.comment}</p>
                  </div>
                </div>
              ))}
            </div>
          </InfiniteScroll>
          {isFetchingNextPage && (
            <p className="text-center text-gray-500 mt-4">Loading more...</p>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackSection;