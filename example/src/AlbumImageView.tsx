import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import FastImage from 'react-native-fast-image';
import { AlbumComment } from '../interfaces/AlbumDataType';
import Axios from 'axios';
import { API_ADDRESS, S3_URL } from '../system/const';
import { useUser } from '../providers/userProvider';
import moment from 'moment-timezone';
import { useForm } from 'react-hook-form';
import i18n from '../system/i18n';
import { useContacts } from '../providers/contactProvider';
import Share from 'react-native-share';
import mime from 'mime';
import RNFetchBlob from 'rn-fetch-blob';
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuTrigger,
} from 'react-native-popup-menu';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { CameraRoll } from '@react-native-camera-roll/camera-roll';
import { useAlert } from '../providers/alertProvider';
import _ from 'lodash';
import { useAlbums } from '../providers/albumProvider';
// @ts-ignore
import UilHeart from '@lawenlerk/react-native-unicons/icons/uil-heart';
// @ts-ignore
import UilComment from '@lawenlerk/react-native-unicons/icons/uil-comment-alt';
// @ts-ignore
import UilSend from '@lawenlerk/react-native-unicons/icons/uil-telegram-alt';
// @ts-ignore
import UilShare from '@lawenlerk/react-native-unicons/icons/uil-share-alt';
// @ts-ignore
import UilDownload from '@lawenlerk/react-native-unicons/icons/uil-import';
import EmptyUser from './empty-user';

// @ts-ignore
import UilPlay from '@lawenlerk/react-native-unicons/icons/uil-play';

const scope = 'components.album_image';

const MultiTapOverlay = ({
  onPress,
  onLongPress,
  onDoubleTap,
  children,
}: any) => {
  let tapCount = 0;
  let timeout: NodeJS.Timeout;

  const handlePress = () => {
    if (timeout) {
      clearTimeout(timeout);
    }

    tapCount++;

    setTimeout(() => {
      if (tapCount === 1) {
        onPress();
      } else if (tapCount === 2) {
        onDoubleTap();
      }

      tapCount = 0;
    }, 500);
  };
  const handleLongPress = () => onLongPress && onLongPress();

  return (
    <TouchableOpacity
      delayLongPress={1000}
      activeOpacity={0.8}
      onLongPress={handleLongPress}
      onPress={handlePress}
    >
      {children}
    </TouchableOpacity>
  );
};

const AlbumImageView = ({
  album,
  albumImage,
  navigation,
  onPictureTap,
  classes,
}: any) => {
  if (!albumImage) {
    return null;
  }

  const { deletePicture } = useAlbums();
  const { showYesNoDialog, showNotification } = useAlert();
  const [image, setImage] = useState(albumImage);
  const { user, token } = useUser();
  const [liked, setLiked] = useState<boolean>(
    albumImage.likes && albumImage.likes.indexOf(user?._id ?? '') !== -1
  );
  const [showComments, setShowComments] = useState<boolean>(false);
  const [downloadingPhoto, setDownloadingPhoto] = useState<boolean>(false);
  const [isPaused, setIsPaused] = useState<boolean>(true);
  const [isFullScreen, setIsFullScreen] = useState(false);

  const [isLoading, setIsLoading] = useState<boolean>(true);
  const { getIdentity } = useContacts();
  const [comments, setComments] = useState<AlbumComment[]>(
    albumImage.comments ?? []
  );
  const {
    control,
    handleSubmit,
    setValue,
    formState: { errors },
    getValues,
    reset,
  } = useForm({
    defaultValues: {
      comment: '',
      comment_edit: '',
    },
  });
  const { changePictureDescription } = useAlbums();

  const like = () => {
    Axios.post(
      API_ADDRESS + '/api/picture/' + image._id + '/like',
      {},
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
    )
      .then((res: any) => {
        setLiked(true);

        image.likes.push(user?._id);

        setImage(_.cloneDeep(image));
      })
      .catch((err) => {
        console.log(err.toJson());
      });
  };

  const unLike = () => {
    Axios.post(
      API_ADDRESS + '/api/picture/' + image._id + '/unlike',
      {},
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
    )
      .then((res: any) => {
        setLiked(false);

        image.likes = image.likes.filter((elem: string) => elem != user?._id);

        setImage(_.cloneDeep(image));
      })
      .catch((err) => {
        console.log(err.toJson());
      });
  };

  const deleteImage = () => {
    deletePicture(image._id);

    showYesNoDialog({
      onSuccess: () => {
        Axios.delete(API_ADDRESS + '/api/picture/' + image._id, {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': token,
          },
        })
          .then((res: any) => {
            navigation.goBack();
          })
          .catch((err) => {
            console.log(err.toJson());
          });
      },
      title: i18n.t('delete_picture', { scope }),
      description: i18n.t('all_your_picture_will_be_deleted', { scope }),
    });
  };

  const share = () => {
    let url =
      S3_URL + (image.type === 'picture' ? image.url + '_medium' : image.url);
    RNFetchBlob.fetch('GET', url).then((res) => {
      let status = res.info().status;
      if (status == 200) {
        // the conversion is done in native code
        let base64Str = res.base64();

        let shareOptions: any = {
          title: album.name,
          message: image.description ?? '',
          type: mime.getType(image.url),
          url:
            'data:' +
            mime.getType(image.url) +
            ';' +
            res.type +
            ',' +
            base64Str,
          filename: 'partage.png',
          showAppsToView: true,
        };

        Share.open(shareOptions)
          .then((res) => {})
          .catch((err) => {
            err && console.log(err);
          });
      } else {
        // handle other status codes
      }
    });
  };

  const getExtension = (filename: any) => {
    const lastDotIndex = filename.lastIndexOf('.');
    if (lastDotIndex !== -1 && lastDotIndex < filename.length - 1) {
      return filename.substr(lastDotIndex + 1).toLowerCase();
    }
    return null;
  };

  const downloadMedia = async () => {
    setDownloadingPhoto(true);

    const extension = getExtension(image.url);

    if (extension === 'jpg' || extension === 'jpeg' || extension === 'png') {
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: extension,
      }).fetch('GET', S3_URL + image.url);

      let status = res.info().status;

      if (status == 200) {
        let path = res.path();

        await CameraRoll.save(path).then(() => {
          showNotification({
            message: i18n.t('photo_has_been_saved_in', { scope }),
            type: 'success',
          });
          //res.flush();
          setDownloadingPhoto(false);
        });
      } else {
        showNotification({
          message: i18n.t('problem_download_photo', { scope }),
          type: 'danger',
        });
      }
    } else if (
      extension === 'mp4' ||
      extension === 'mov' ||
      extension === 'avi'
    ) {
      // Télécharger une vidéo
      const res = await RNFetchBlob.config({
        fileCache: true,
        appendExt: 'mp4',
      }).fetch('GET', S3_URL + image.url);

      let status = res.info().status;

      if (status == 200) {
        let path = res.path();

        await CameraRoll.save(path).then(() => {
          showNotification({
            message: i18n.t('video_has_been_saved_in', { scope }),
            type: 'success',
          });
        });
        res.flush();
      } else {
        showNotification({
          message: i18n.t('problem_download_video', { scope }),
          type: 'danger',
        });
      }
    }
    setDownloadingPhoto(false);
  };

  const reportPhoto = () => {
    Axios.post(
      API_ADDRESS + '/api/support/image',
      {
        picture: image._id,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
    )
      .then((res: any) => {
        showNotification({
          message: i18n.t('photo_has_been_reported', { scope }),
          type: 'success',
        });
      })
      .catch((err) => {
        console.log(err.toJson());
      });
  };

  const setMainPictureAlbum = () => {
    Axios.post(
      API_ADDRESS + '/api/album/' + image.album + '/main_picture',
      {
        picture: image._id,
      },
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': token,
        },
      }
    )
      .then((res: any) => {
        showNotification({
          message: i18n.t('photo_has_been_set_main_picture', { scope }),
          type: 'success',
        });
      })
      .catch((err) => {
        console.log(err.toJson());
      });
  };

  const editPicture = () => {
    navigation.navigate('ChatStack', {
      screen: 'EditPicture',
      params: { album, albumImage: image },
    });
  };

  const playVideo = async () => {
    if (isPaused) {
      setIsPaused(false);
    } else {
      setIsPaused(true);
    }
  };

  const handleEnterFullscreen = () => {
    setIsFullScreen(true);
    setIsPaused(true);
    onPictureTap(image);
  };

  useEffect(() => {
    if (changePictureDescription._id === image._id) {
      image.description = changePictureDescription.description;

      setImage({ ...image });
    }
  }, [changePictureDescription]);

  useEffect(() => {
    if (image._id !== albumImage._id) {
      setImage(albumImage);
      setLiked(
        albumImage.likes && albumImage.likes.indexOf(user?._id ?? '') !== -1
      );
      setComments(albumImage.comments ?? []);
    }
  }, [albumImage]);

  useEffect(() => {
    if (changePictureDescription._id === image._id) {
      image.description = changePictureDescription.description;

      setImage({ ...image });
    }
  }, [changePictureDescription]);

  //image.created_by_avatar = { uri: S3_URL + user?.avatar };
  //image.nb_comments_not_seen = 2;
  return (
    <View className={classes}>
      <View className="flex flex-row py-4 px-2 justify-between items-center">
        <TouchableOpacity
          className="flex flex-row items-center"
          onPress={() =>
            navigation.navigate('ChatStack', {
              screen: 'Profile',
              params: {
                phone: image.creator_phone,
              },
            })
          }
        >
          <View className="relative">
            <EmptyUser classes="w-8 h-8 rounded-full" />
            {image.created_by_avatar && (
              <FastImage
                resizeMode="cover"
                className="w-8 h-8 rounded-full absolute"
                source={{ uri: S3_URL + image.created_by_avatar }}
              />
            )}
          </View>
          <View className="px-2">
            <Text className="text-[#8A8A8D]">
              {i18n.t('published_by', { scope })}{' '}
            </Text>
            <Text className="text-black font-bold">
              {image.created_by === user?._id
                ? 'Moi'
                : getIdentity(image.creator)}
            </Text>
          </View>
        </TouchableOpacity>
        <View className="">
          <Menu>
            <MenuTrigger>
              <Ionicons name="ellipsis-vertical" color="black" size={24} />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: {
                  width: 200,
                },
              }}
            >
              {image.created_by === user?._id && (
                <MenuOption onSelect={editPicture}>
                  <Text className="text-black p-2">
                    Ajouter une description
                  </Text>
                </MenuOption>
              )}
              {/* {image.created_by === user?._id && <MenuOption onSelect={deleteImage}> */}
              <MenuOption onSelect={deleteImage}>
                <Text className="text-black p-2">
                  {i18n.t('delete', { scope })}
                </Text>
              </MenuOption>
              {/* </MenuOption>} */}
              {image.type === 'picture' && (
                <MenuOption onSelect={setMainPictureAlbum}>
                  <Text className="text-black p-2">
                    {i18n.t('set_main_photo', { scope })}
                  </Text>
                </MenuOption>
              )}
              <MenuOption onSelect={reportPhoto}>
                <Text className="text-black p-2">
                  {i18n.t('report', { scope })}
                </Text>
              </MenuOption>
              {/* <MenuOption onSelect={downloadPhoto}>
                  <Text className="text-black p-2">{i18n.t("download", { scope })}</Text>
                </MenuOption> */}
            </MenuOptions>
          </Menu>
        </View>
      </View>

      <MultiTapOverlay
        onPress={() =>
          image.type == 'video' ? onPictureTap(image) : onPictureTap(image)
        }
        onDoubleTap={() =>
          image.likes_enable && !liked
            ? like()
            : image.likes_enable && liked
            ? unLike()
            : null
        }
      >
        <View
          style={{
            height:
              image.height * (Dimensions.get('window').width / image.width),
          }}
        >
          {image.type === 'picture' && (
            <FastImage
              resizeMode="contain"
              className="bg-gray-500 my-1"
              style={{
                height:
                  image.height * (Dimensions.get('window').width / image.width),
              }}
              source={{ uri: S3_URL + image.url + '_medium' }}
            />
          )}

          {image.type === 'video' && (
            <>
              {isPaused ? (
                <View>
                  <FastImage
                    source={{ uri: S3_URL + image.url + '_small' }}
                    style={{
                      height:
                        image.height *
                        (Dimensions.get('window').width / image.width),
                    }}
                    className="w-full"
                  />
                  <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center z-0">
                    <TouchableOpacity
                      className={'p-1 rounded-xl bg-[#614cd8]'}
                      onPress={() => onPictureTap(image)}
                    >
                      <UilPlay color="#DCDCDC" size={64} />
                    </TouchableOpacity>
                  </View>
                </View>
              ) : (
                <>
                  {/* <VideoPlayer
                    source={{ uri: S3_URL + image.url }}
                    onError={(err) => console.log('err', err)}
                    resizeMode={isFullScreen ? 'cover' : 'contain'}
                    repeat={false}
                    paused={isPaused}
                    className="w-full"
                    style={{
                      height: isFullScreen
                        ? Dimensions.get('window').height
                        : image.height *
                          (Dimensions.get('window').width / image.width),
                      width: Dimensions.get('window').width // Ajout de cette ligne
                    }}
                    onEnterFullscreen={() => handleEnterFullscreen()}
                    onEnd={() => setIsPaused(false)}
                    onLoad={() => setIsLoading(false)}
                    onBuffer={() => console.log('-- onBuffer')} //setIsLoading(true)}
                    onLoadStart={() => setIsLoading(true)} //
                    onVideoLoadStart={() => console.log('-- onVideoLoadStart')} //setIsLoading(false)}
                    onVideoLoad={() => console.log('-- onVideoLoad')} //setIsLoading(false)}
                    bufferConfig={{
                      minBufferMs: 15000,
                      maxBufferMs: 50000,
                      bufferForPlaybackMs: 2500,
                      bufferForPlaybackAfterRebufferMs: 5000
                    }}
                    disableBack */}
                  {/* /> */}
                  {isLoading && (
                    <View className="absolute left-0 right-0 top-0 bottom-0 items-center justify-center z-0">
                      <View className="bg-[#585555] p-2 rounded-xl">
                        <ActivityIndicator size="large" color="#222" />
                      </View>
                    </View>
                  )}
                </>
              )}
            </>
          )}
        </View>
      </MultiTapOverlay>

      <View className="px-4 pt-2 pb-0">
        <View>
          <View className="flex flex-row justify-between py-2 mb-2">
            <View className="flex flex-row flex-1">
              <View className="flex-row ">
                {image.likes_enable && liked && (
                  <TouchableOpacity onPress={unLike}>
                    <FastImage
                      className="w-6 h-6 mr-4"
                      source={require('../assets/images/liked-heart.png')}
                    />
                  </TouchableOpacity>
                )}

                {image.likes_enable && !liked && (
                  <TouchableOpacity className="mr-4" onPress={like}>
                    <UilHeart color="black" size={24} />
                  </TouchableOpacity>
                )}

                {image.comments_enable && (
                  <TouchableOpacity
                    onPress={() => {
                      navigation.navigate('ChatStack', {
                        screen: 'Comments',
                        params: {
                          image,
                          focus: true,
                        },
                      });
                    }}
                    className="mr-4"
                  >
                    <UilComment color="black" size={24} />
                  </TouchableOpacity>
                )}

                <TouchableOpacity
                  onPress={() => {
                    navigation.navigate('ChatStack', {
                      screen: 'Share',
                      params: { albumImage: image },
                    });
                  }}
                >
                  <UilSend color="black" size={24} />
                </TouchableOpacity>
              </View>
              <View className="flex-row flex-1 justify-end">
                <TouchableOpacity className="mr-4" onPress={share}>
                  <UilShare color="black" size={24} />
                </TouchableOpacity>
                <TouchableOpacity onPress={downloadMedia}>
                  {downloadingPhoto ? (
                    <ActivityIndicator color="#222" />
                  ) : (
                    <UilDownload color="black" size={24} />
                  )}
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {image.likes.length > 0 && (
            <TouchableOpacity
              onPress={() =>
                navigation.navigate('ChatStack', {
                  screen: 'Likes',
                  params: { image },
                })
              }
            >
              {image.likes_enable && (
                <Text className="mb-3 text-black">
                  Aimé par{' '}
                  <Text className="font-bold">
                    {image.likes.length > 1
                      ? i18n.t('liked_by_plurial', {
                          scope,
                          nb: image.likes.length,
                        })
                      : i18n.t('liked_by', {
                          scope,
                          nb: image.likes.length,
                        })}
                  </Text>
                </Text>
              )}
            </TouchableOpacity>
          )}

          {image.description && image.description.trim() !== '' && (
            <Text className="mb-3 text-black font-semibold">
              {image.description}
            </Text>
          )}

          {image.comments_enable && comments.length > 0 && (
            <View className="flex-row justify-between">
              <TouchableOpacity
                onPress={() =>
                  navigation.navigate('ChatStack', {
                    screen: 'Comments',
                    params: {
                      image,
                    },
                  })
                }
              >
                <Text
                  className={`font-bold mb-3 text-black ${
                    image.nb_comments_not_seen > 0 && 'text-[#604CD8]'
                  }`}
                >
                  {/* {!showComments
                    ? i18n.t('show', { scope })
                    : i18n.t('hide', { scope })}{' '} */}
                  {comments && comments.length > 0
                    ? (comments.length == 1
                        ? i18n.t('show_comment', { scope })
                        : i18n.t('show_comments', {
                            scope,
                            nb: comments.length,
                          })) +
                      ' ' +
                      (image.nb_comments_not_seen
                        ? `(${image.nb_comments_not_seen} ` +
                          (comments.length == 1
                            ? i18n.t('new', { scope })
                            : i18n.t('news', { scope })) +
                          ')'
                        : '')
                    : comments && comments.length == 0
                    ? i18n.t('show_comment', { scope, nb: 0 })
                    : i18n.t('show_comment', { scope, nb: 0 })}
                </Text>
              </TouchableOpacity>
            </View>
          )}

          <Text className="block font-light text-zinc-500 text-xs text-left mb-5">
            {moment(image.created_at).calendar()}
          </Text>

          <View className="h-2" />
        </View>
      </View>
    </View>
  );
};

const rerender = (prevProps: any, nextProps: any) => {
  if (prevProps.albumImage === nextProps.albumImage) {
    return true; // donot re-render
  }
  return false; // will re-render
};

export default React.memo(AlbumImageView, rerender);
